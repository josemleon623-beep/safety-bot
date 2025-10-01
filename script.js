const $ = (q)=>document.querySelector(q);
const messagesEl = $("#messages");
const form = $("#chatForm");
const input = $("#userInput");
const clearBtn = $("#clearBtn");
const siteTitle = $("#siteTitle");
const accentColor = $("#accentColor");
const systemPrompt = $("#systemPrompt");
const modelSel = $("#model");

function addMessage(role, text){
  const wrap = document.createElement("div");
  wrap.className = `message ${role}`;
  wrap.innerHTML = `<div class="role">${role==='user'?'U':'A'}</div><div class="bubble"></div>`;
  wrap.querySelector(".bubble").textContent = text;
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

clearBtn.onclick = ()=>{ messagesEl.innerHTML=''; localStorage.removeItem('chat'); addMessage('assistant',"Hi! Ask me a safety question to get started."); save(); };

function save(){
  localStorage.setItem('chat', messagesEl.innerHTML);
  localStorage.setItem('title', siteTitle.value || '');
  localStorage.setItem('accent', accentColor.value || '');
  localStorage.setItem('sys', systemPrompt.value || '');
  localStorage.setItem('model', modelSel.value || '');
  document.documentElement.style.setProperty('--accent', accentColor.value || '#0f766e');
  document.title = siteTitle.value || 'Safety Assistant';
  const h1 = document.querySelector('header h1'); if(h1) h1.textContent = siteTitle.value || 'Safety Assistant';
}

function load(){
  messagesEl.innerHTML = localStorage.getItem('chat') || '';
  siteTitle.value = localStorage.getItem('title') || 'B&B Safety Assistant';
  accentColor.value = localStorage.getItem('accent') || '#0f766e';
  systemPrompt.value = localStorage.getItem('sys') || '';
  modelSel.value = localStorage.getItem('model') || 'gpt-4o-mini';
  save();
  if(!messagesEl.innerHTML) addMessage('assistant',"Hi! Ask me a safety question to get started.");
}
load();
siteTitle.oninput = save; accentColor.oninput = save; systemPrompt.oninput = save; modelSel.onchange = save;

form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  addMessage('user', text);
  input.value = '';
  save();

  addMessage('assistant', '…thinking…');
  save();

  try{
    const res = await fetch('/api/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        model: $("#model").value,
        system: systemPrompt.value || undefined,
        messages: Array.from(document.querySelectorAll('.message')).map(m=>{
          const role = m.classList.contains('user')?'user':'assistant';
          const content = m.querySelector('.bubble').textContent;
          return {role, content};
        }).filter(m=>m.content!=='…thinking…')
      })
    });
    if(!res.ok){ throw new Error('API error ' + res.status); }
    const data = await res.json();
    // Replace the last assistant bubble (thinking) with the real answer
    const bubbles = document.querySelectorAll('.message.assistant .bubble');
    const last = bubbles[bubbles.length-1];
    last.textContent = data.answer || '(no answer)';
    save();
  }catch(err){
    const bubbles = document.querySelectorAll('.message.assistant .bubble');
    const last = bubbles[bubbles.length-1];
    last.textContent = 'Error: ' + err.message + '. Check your deployment/API key.';
    save();
  }
});
