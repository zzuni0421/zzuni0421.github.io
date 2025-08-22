const authScreen = document.getElementById("authScreen");
const noteScreen = document.getElementById("noteScreen");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const authMsg = document.getElementById("authMsg");

const welcome = document.getElementById("welcome");
const noteInput = document.getElementById("noteInput");
const saveBtn = document.getElementById("saveBtn");
const noteList = document.getElementById("noteList");

const dailyNoteInput = document.getElementById("dailyNoteInput");
const saveDailyBtn = document.getElementById("saveDailyBtn");
const dailyNoteList = document.getElementById("dailyNoteList");

let currentUser = null;

// 🔹 회원가입
signupBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    authMsg.textContent = "아이디와 비밀번호를 입력하세요.";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (users[username]) {
    authMsg.textContent = "이미 존재하는 아이디입니다.";
    return;
  }

  users[username] = { password, notes: [], dailyNotes: {} };
  localStorage.setItem("users", JSON.stringify(users));

  authMsg.textContent = "가입 성공! 로그인 해주세요.";
});

// 🔹 로그인
loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  let users = JSON.parse(localStorage.getItem("users")) || {};

  if (!users[username] || users[username].password !== password) {
    authMsg.textContent = "아이디 또는 비밀번호가 틀렸습니다.";
    return;
  }

  currentUser = username;
  showNoteScreen();
});

// 🔹 로그아웃
logoutBtn.addEventListener("click", () => {
  currentUser = null;
  noteScreen.style.display = "none";
  authScreen.style.display = "block";
});

// 🔹 화면 전환
function showNoteScreen() {
  authScreen.style.display = "none";
  noteScreen.style.display = "block";
  welcome.textContent = `환영합니다, ${currentUser}님!`;

  renderNotes();
  renderDailyNote();
}

// 🔹 전체 기록 저장
saveBtn.addEventListener("click", () => {
  let users = JSON.parse(localStorage.getItem("users"));
  users[currentUser].notes.push(noteInput.value);
  localStorage.setItem("users", JSON.stringify(users));
  noteInput.value = "";
  renderNotes();
});

// 🔹 하루 기록 저장 (날짜별 저장)
saveDailyBtn.addEventListener("click", () => {
  let today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  let users = JSON.parse(localStorage.getItem("users"));

  users[currentUser].dailyNotes[today] = dailyNoteInput.value;
  localStorage.setItem("users", JSON.stringify(users));
  renderDailyNote();
});

// 🔹 전체 기록 렌더링
function renderNotes() {
  let users = JSON.parse(localStorage.getItem("users"));
  noteList.innerHTML = "";
  users[currentUser].notes.forEach((note, idx) => {
    let li = document.createElement("li");
    li.textContent = `${idx + 1}. ${note}`;
    noteList.appendChild(li);
  });
}

// 🔹 하루 기록 렌더링
function renderDailyNote() {
  let today = new Date().toISOString().split("T")[0];
  let users = JSON.parse(localStorage.getItem("users"));

  dailyNoteList.innerHTML = "";

  if (users[currentUser].dailyNotes[today]) {
    let li = document.createElement("li");
    li.textContent = `${today}: ${users[currentUser].dailyNotes[today]}`;
    dailyNoteList.appendChild(li);
    dailyNoteInput.value = users[currentUser].dailyNotes[today];
  }
}
