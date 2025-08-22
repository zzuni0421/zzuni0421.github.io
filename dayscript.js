document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'dailyJournal.v1';

  // Elements
  const dateInput = document.getElementById('dateInput');
  const moodSelect = document.getElementById('moodSelect');
  const tagsInput = document.getElementById('tagsInput');
  const contentInput = document.getElementById('contentInput');
  const charCount = document.getElementById('charCount');
  const autosaveHint = document.getElementById('autosaveHint');

  const btnNew = document.getElementById('btnNew');
  const btnSave = document.getElementById('btnSave');
  const btnDelete = document.getElementById('btnDelete');
  const btnExport = document.getElementById('btnExport');
  const btnImport = document.getElementById('btnImport');
  const btnClearAll = document.getElementById('btnClearAll');
  const fileImport = document.getElementById('fileImport');

  const entryList = document.getElementById('entryList');
  const searchInput = document.getElementById('searchInput');
  const filterMood = document.getElementById('filterMood');

  // State
  let db = loadDB();

  // Utils
  function todayStr(){
    const d = new Date(); const m = String(d.getMonth()+1).padStart(2,'0');
    const day = String(d.getDate()).padStart(2,'0'); return `${d.getFullYear()}-${m}-${day}`;
  }
  function loadDB(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
    catch { return {}; }
  }
  function saveDB(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); }

  function readForm(){
    return {
      date: dateInput.value,
      mood: moodSelect.value,
      tags: tagsInput.value,
      content: contentInput.value
    };
  }
  function writeForm(entry){
    dateInput.value = entry.date || todayStr();
    moodSelect.value = entry.mood || '';
    tagsInput.value = entry.tags || '';
    contentInput.value = entry.content || '';
    updateCharCount();
  }

  // Rendering
  function renderList(){
    const q = (searchInput.value || '').toLowerCase().trim();
    const mood = filterMood.value;
    const items = Object.values(db).sort((a,b)=> b.date.localeCompare(a.date));

    entryList.innerHTML = '';
    const frag = document.createDocumentFragment();

    items.forEach(item => {
      if (mood && item.mood !== mood) return;
      const hay = (item.content + ' ' + (item.tags||'') + ' ' + (item.mood||'')).toLowerCase();
      if (q && !hay.includes(q)) return;

      const li = document.createElement('li');
      li.className = 'entry-item';
      li.dataset.date = item.date;

      const left = document.createElement('div');
      left.className = 'entry-main';
      const title = document.createElement('div');
      title.innerHTML = `<span class="entry-date">${item.date}</span> ${item.mood||''}`;
      const tags = document.createElement('div');
      tags.className = 'entry-tags';
      tags.textContent = (item.tags||'').split(',').map(s=>s.trim()).filter(Boolean).map(t=>`#${t}`).join(' ');
      const preview = document.createElement('div');
      preview.className = 'entry-tags';
      preview.textContent = (item.content||'').slice(0,80).replace(/\s+/g,' ') + ((item.content||'').length>80?'…':'');
      left.append(title,tags,preview);

      const right = document.createElement('div');
      right.className = 'entry-right';
      const openBtn = document.createElement('button');
      openBtn.className = 'secondary';
      openBtn.textContent = '열기';
      openBtn.addEventListener('click', ()=> openEntry(item.date));
      const delBtn = document.createElement('button');
      delBtn.className = 'danger';
      delBtn.textContent = '삭제';
      delBtn.addEventListener('click', ()=> deleteEntry(item.date));
      right.append(openBtn, delBtn);

      li.append(left, right);
      frag.append(li);
    });

    entryList.append(frag);
  }

  function openEntry(date){
    const e = db[date]; if(!e) return;
    writeForm(e);
    // 스크롤 상단
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Actions
  function saveEntry(){
    const e = readForm();
    if (!e.date) e.date = todayStr();
    db[e.date] = e;
    saveDB();
    pulseAutosave('저장됨');
    renderList();
  }

  function deleteEntry(date){
    const key = date || dateInput.value;
    if (!key || !db[key]) return;
    if (!confirm(`${key} 기록을 삭제할까요?`)) return;
    delete db[key];
    saveDB();
    if (key === dateInput.value) writeForm({date: todayStr(), mood:'', tags:'', content:''});
    renderList();
  }

  function newEntry(){
    writeForm({ date: todayStr(), mood:'', tags:'', content:'' });
  }

  function exportData(){
    const blob = new Blob([JSON.stringify(db,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'daily-journal.json'; a.click();
    URL.revokeObjectURL(url);
  }

  function importData(file){
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        if (typeof obj !== 'object' || Array.isArray(obj)) throw 0;
        db = obj;
        saveDB();
        renderList();
        alert('가져오기 완료!');
      } catch {
        alert('가져오기 실패: JSON 형식이 올바르지 않습니다.');
      }
    };
    reader.readAsText(file, 'utf-8');
  }

  // Helpers
  function updateCharCount(){
    const len = (contentInput.value||'').length;
    charCount.textContent = `${len}자`;
  }
  let autosaveTimer;
  function pulseAutosave(text){
    autosaveHint.textContent = `· ${text}`;
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(()=> autosaveHint.textContent = '', 1200);
  }

  // Events
  btnNew.addEventListener('click', newEntry);
  btnSave.addEventListener('click', saveEntry);
  btnDelete.addEventListener('click', ()=> deleteEntry());
  btnExport.addEventListener('click', exportData);
  btnImport.addEventListener('click', ()=> fileImport.click());
  btnClearAll.addEventListener('click', () => {
    if (!confirm('모든 기록을 지울까요? 이 작업은 되돌릴 수 없습니다.')) return;
    db = {}; saveDB(); renderList(); newEntry();
  });
  fileImport.addEventListener('change', (e)=>{
    const f = e.target.files[0]; if (f) importData(f);
    fileImport.value = '';
  });

  // Auto-save on input (debounced)
  function debounceSave(){
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(saveEntry, 600);
  }
  [dateInput, moodSelect, tagsInput, contentInput].forEach(el=>{
    el.addEventListener('input', ()=>{
      if (el === contentInput) updateCharCount();
      debounceSave();
    });
  });

  // Init
  if (!dateInput.value) dateInput.value = todayStr();
  if (!db[dateInput.value]) db[dateInput.value] = {date: dateInput.value, mood:'', tags:'', content:''};
  writeForm(db[dateInput.value]);
  renderList();
});
