// ====================== 회원 관리 ======================
const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const authMsg = document.getElementById("authMsg");
const btnLogin = document.getElementById("btnLogin");
const btnSignup = document.getElementById("btnSignup");
const btnLogout = document.getElementById("btnLogout");

let currentUser = null;

function loadUsers() {
  return JSON.parse(localStorage.getItem("users") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

btnSignup.addEventListener("click", () => {
  const users = loadUsers();
  const u = usernameInput.value.trim();
  const p = passwordInput.value.trim();

  if (!u || !p) return (authMsg.textContent = "아이디와 비밀번호를 입력하세요");
  if (users[u]) return (authMsg.textContent = "이미 존재하는 아이디입니다.");

  users[u] = { password: p, entries: [] };
  saveUsers(users);
  authMsg.textContent = "회원가입 완료! 로그인하세요.";
});

btnLogin.addEventListener("click", () => {
  const users = loadUsers();
  const u = usernameInput.value.trim();
  const p = passwordInput.value.trim();

  if (!users[u]) return (authMsg.textContent = "아이디가 존재하지 않습니다.");
  if (users[u].password !== p) return (authMsg.textContent = "비밀번호가 틀렸습니다.");

  currentUser = u;
  authSection.classList.add("hidden");
  appSection.classList.remove("hidden");
  renderList();
});

btnLogout.addEventListener("click", () => {
  currentUser = null;
  appSection.classList.add("hidden");
  authSection.classList.remove("hidden");
  usernameInput.value = "";
  passwordInput.value = "";
});

// ====================== 기록 관리 ======================
const dateInput = document.getElementById("dateInput");
const moodSelect = document.getElementById("moodSelect");
const tagsInput = document.getElementById("tagsInput");
const contentInput = document.getElementById("contentInput");
const charCount = document.getElementById("charCount");
const autosaveHint = document.getElementById("autosaveHint");

const btnNew = document.getElementById("btnNew");
const btnSave = document.getElementById("btnSave");
const btnDelete = document.getElementById("btnDelete");
const btnExport = document.getElementById("btnExport");
const btnImport = document.getElementById("btnImport");
const fileImport = document.getElementById("fileImport");
const btnClearAll = document.getElementById("btnClearAll");

const searchInput = document.getElementById("searchInput");
const filterMood = document.getElementById("filterMood");
const entryList = document.getElementById("entryList");

let editingIndex = null;

function getEntries() {
  const users = loadUsers();
  return users[currentUser]?.entries || [];
}

function saveEntries(entries) {
  const users = loadUsers();
  users[currentUser].entries = entries;
  saveUsers(users);
}

function renderList() {
  const entries = getEntries();
  const keyword = searchInput.value.toLowerCase();
  const moodFilter = filterMood.value;

  entryList.innerHTML = "";
  entries.forEach((e, i) => {
    if (
      (keyword && !e.content.toLowerCase().includes(keyword) && !e.tags.includes(keyword)) ||
      (moodFilter && e.mood !== moodFilter)
    )
      return;

    const li = document.createElement("li");
    li.textContent = `${e.date} ${e.mood || ""} ${e.tags.join(", ")} - ${e.content.slice(0, 20)}...`;
    li.addEventListener("click", () => loadEntry(i));
    entryList.appendChild(li);
  });
}

function loadEntry(i) {
  const e = getEntries()[i];
  dateInput.value = e.date;
  moodSelect.value = e.mood;
  tagsInput.value = e.tags.join(", ");
  contentInput.value = e.content;
  editingIndex = i;
  updateCharCount();
}

function clearEditor() {
  dateInput.value = "";
  moodSelect.value = "";
  tagsInput.value = "";
  contentInput.value = "";
  editingIndex = null;
  updateCharCount();
}

btnNew.addEventListener("click", clearEditor);

btnSave.addEventListener("click", () => {
  const entries = getEntries();
  const newEntry = {
    date: dateInput.value,
    mood: moodSelect.value,
    tags: tagsInput.value.split(",").map(t => t.trim()).filter(Boolean),
    content: contentInput.value,
  };

  if (editingIndex !== null) {
    entries[editingIndex] = newEntry;
  } else {
    entries.push(newEntry);
  }
  saveEntries(entries);
  autosaveHint.textContent = "저장됨!";
  setTimeout(() => (autosaveHint.textContent = ""), 1500);
  renderList();
});

btnDelete.addEventListener("click", () => {
  if (editingIndex === null) return;
  const entries = getEntries();
  entries.splice(editingIndex, 1);
  saveEntries(entries);
  clearEditor();
  renderList();
});

btnClearAll.addEventListener("click", () => {
  if (!confirm("정말 모든 기록을 지우시겠습니까?")) return;
  saveEntries([]);
  clearEditor();
  renderList();
});

// ====================== 내보내기/가져오기 ======================
btnExport.addEventListener("click", () => {
  const entries = getEntries();
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${currentUser}_entries.json`;
  a.click();
  URL.revokeObjectURL(url);
});

btnImport.addEventListener("click", () => fileImport.click());

fileImport.addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      saveEntries(data);
      renderList();
    } catch {
      alert("가져오기 실패: 올바른 JSON 파일이 아닙니다.");
    }
  };
  reader.readAsText(file);
});

// ====================== 기타 기능 ======================
contentInput.addEventListener("input", updateCharCount);
searchInput.addEventListener("input", renderList);
filterMood.addEventListener("change", renderList);

function updateCharCount() {
  charCount.textContent = `${contentInput.value.length}자`;
}

function renderHistory() {
  const historyList = document.getElementById("entryList");
  historyList.innerHTML = "";

  history.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.date} ${item.mood} - ${item.content.slice(0, 20)}...`;

    // 오늘 일기 보기 버튼
    const diaryBtn = document.createElement("button");
    diaryBtn.textContent = "오늘 일기 보기";
    diaryBtn.className = "secondary small-btn";
    diaryBtn.addEventListener("click", () => {
      // 아이디 로컬에서 가져오기 + 순번 처리
      const baseId = item.user || "guest";
      let uniqueId = generateUniqueId(baseId); // 앞에서 만든 중복 방지 함수
      const diaryUrl = `${location.origin}/하루일과?${uniqueId}`;
      window.location.href = diaryUrl;
    });

    li.appendChild(diaryBtn);
    historyList.appendChild(li);
  });
}
