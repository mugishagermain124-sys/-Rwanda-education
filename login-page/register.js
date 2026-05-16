const ROLES = {
  student:{
    code:'STU2026', label:'Student', desc:'Code issued by your school administrator',
    color:'#1d4ed8', bg:'#dbeafe',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
    fields:[
      {id:'fn',  label:'First name',      type:'text',     ph:'e.g. Aline',               half:true},
      {id:'ln',  label:'Last name',       type:'text',     ph:'e.g. Uwase',               half:true},
      {id:'sid', label:'Student ID',      type:'text',     ph:'Your school student ID'},
      {id:'em',  label:'Email address',    type:'email',    ph:'aline.uwase@student.rw'},
      {id:'sch', label:'School name',     type:'text',     ph:'e.g. G.S. Kigali City'},
      {id:'gr',  label:'Class / Grade',   type:'text',     ph:'e.g. S4 Sciences'},
      {id:'pw',  label:'Password',        type:'password', ph:'Create a strong password', strength:true},
      {id:'cpw', label:'Confirm password',type:'password', ph:'Re-enter your password'},
    ]
  },
  teacher:{
    code:'TCH2026', label:'Teacher', desc:'Code issued by your district office',
    color:'#059669', bg:'#d1fae5',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    fields:[
      {id:'fn',  label:'First name',           type:'text',     ph:'e.g. Jean',               half:true},
      {id:'ln',  label:'Last name',            type:'text',     ph:'e.g. Ndayisaba',          half:true},
      {id:'em',  label:'Institutional email',  type:'email',    ph:'j.ndayisaba@school.rw'},
      {id:'tid', label:'Teacher ID / REB No.', type:'text',     ph:'e.g. REB-TCH-000123'},
      {id:'sch', label:'School / Institution', type:'text',     ph:'e.g. G.S. Remera'},
      {id:'sub', label:'Subject(s) taught',    type:'text',     ph:'e.g. Mathematics, Physics'},
      {id:'pw',  label:'Password',             type:'password', ph:'Create a strong password', strength:true},
      {id:'cpw', label:'Confirm password',     type:'password', ph:'Re-enter your password'},
    ]
  },
  headteacher:{
    code:'HEAD2026', label:'School Headteacher', desc:'Code from REB regional office',
    color:'#b45309', bg:'#fef9c3',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    fields:[
      {id:'fn',  label:'First name',            type:'text',     ph:'e.g. Marie',             half:true},
      {id:'ln',  label:'Last name',             type:'text',     ph:'e.g. Mukamana',          half:true},
      {id:'em',  label:'Official email',        type:'email',    ph:'head@school.rw'},
      {id:'hid', label:'Head ID / REB No.',     type:'text',     ph:'e.g. REB-HEAD-000456'},
      {id:'sch', label:'School name',           type:'text',     ph:'e.g. E.S. Nyarugenge'},
      {id:'dis', label:'District',              type:'text',     ph:'e.g. Kigali City'},
      {id:'ph',  label:'Phone number',          type:'tel',      ph:'+250 7XX XXX XXX'},
      {id:'pw',  label:'Password',              type:'password', ph:'Create a strong password', strength:true},
      {id:'cpw', label:'Confirm password',      type:'password', ph:'Re-enter your password'},
    ]
  },
  nesa:{
    code:'NESA2026', label:'REB / NESA Official', desc:'Ministry-issued official access code',
    color:'#7c3aed', bg:'#ede9fe',
    icon:'<svg viewBox="0 0 24 24" fill="none" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    fields:[
      {id:'fn',  label:'First name',              type:'text',     ph:'e.g. Patrick',          half:true},
      {id:'ln',  label:'Last name',               type:'text',     ph:'e.g. Habimana',         half:true},
      {id:'em',  label:'Official ministry email', type:'email',    ph:'p.habimana@mineduc.gov.rw'},
      {id:'sid', label:'Staff / Official ID',     type:'text',     ph:'e.g. NESA-OFF-000789'},
      {id:'dep', label:'Department / Division',   type:'text',     ph:'e.g. Curriculum Development'},
      {id:'ph',  label:'Phone number',            type:'tel',      ph:'+250 7XX XXX XXX'},
      {id:'pw',  label:'Password',                type:'password', ph:'Create a strong password', strength:true},
      {id:'cpw', label:'Confirm password',        type:'password', ph:'Re-enter your password'},
    ]
  }
};

let currentRole = null;

function goTo(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0,0);
}

function onRoleChange(){
  const val = document.getElementById('roleSelect').value;
  const banner = document.getElementById('roleBanner');
  document.getElementById('acErr').classList.remove('show');
  document.getElementById('ac').classList.remove('err');
  if(!val){banner.classList.remove('show');document.getElementById('ac').placeholder='';return;}
  const r = ROLES[val];
  const ic = document.getElementById('rbIcon');
  ic.style.background = r.bg;
  ic.innerHTML = r.icon.replace('stroke-width="2"',`stroke="${r.color}" stroke-width="2"`);
  document.getElementById('rbTitle').textContent = r.label;
  document.getElementById('rbDesc').textContent  = r.desc;
  banner.style.borderLeftColor = r.color;
  banner.classList.add('show');
  document.getElementById('ac').placeholder = `Access code for ${r.label}`;
}

function verifyCode(){
  const sel = document.getElementById('roleSelect').value;
  const code = document.getElementById('ac').value.trim();
  const err  = document.getElementById('acErr');
  const inp  = document.getElementById('ac');
  err.classList.remove('show'); inp.classList.remove('err');
  if(!sel){err.textContent='Please select a role first.';err.classList.add('show');return;}
  if(!code){err.textContent='Please enter the access code.';err.classList.add('show');inp.classList.add('err');return;}
  if(code !== ROLES[sel].code){err.textContent='Incorrect access code. Check with your institution.';err.classList.add('show');inp.classList.add('err');return;}
  currentRole = sel;
  buildP3();
  goTo('p3');
}

function buildP3(){
  const r = ROLES[currentRole];
  const ic = document.getElementById('p3Icon');
  ic.style.background = r.bg;
  ic.innerHTML = r.icon.replace('stroke-width="2"',`stroke="${r.color}" stroke-width="2"`);
  document.getElementById('p3RoleTitle').textContent = r.label;
  document.getElementById('p3Heading').textContent = `Create your ${r.label} account`;
  document.getElementById('p3Sub').textContent = `Fill in your ${r.label.toLowerCase()} details to complete registration.`;

  const container = document.getElementById('dynFields');
  container.innerHTML = '';
  let halfBuf = null;

  r.fields.forEach(f => {
    const wrap = makeField(f);
    if(f.half){
      if(!halfBuf){
        halfBuf = document.createElement('div');
        halfBuf.className = 'frow';
        container.appendChild(halfBuf);
      }
      halfBuf.appendChild(wrap);
      if(halfBuf.children.length === 2) halfBuf = null;
    } else {
      halfBuf = null;
      container.appendChild(wrap);
    }
  });
}

function makeField(f){
  const wrap = document.createElement('div');
  wrap.className = 'fgroup';

  const lbl = document.createElement('label');
  lbl.setAttribute('for', f.id);
  lbl.textContent = f.label;
  wrap.appendChild(lbl);

  const pw = document.createElement('div');
  pw.className = 'pwrap';

  const inp = document.createElement('input');
  inp.type = f.type === 'password' ? 'password' : f.type;
  inp.id   = f.id;
  inp.placeholder = '';

  inp.addEventListener('focus', ()=>{ inp.placeholder = f.ph; });
  inp.addEventListener('blur',  ()=>{ if(!inp.value) inp.placeholder = ''; });

  pw.appendChild(inp);

  if(f.type === 'password'){
    const eyeId = 'eye_'+f.id;
    const btn = document.createElement('button');
    btn.className = 'eye-btn'; btn.tabIndex = -1; btn.type = 'button';
    btn.setAttribute('aria-label','toggle');
    btn.innerHTML = `<svg id="${eyeId}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    btn.onclick = () => toggleEye(f.id, eyeId);
    pw.appendChild(btn);
  }
  wrap.appendChild(pw);

  if(f.strength){
    const st = document.createElement('div');
    st.className = 'strength';
    st.innerHTML = `<div class="bars"><div class="bar" id="b1_${f.id}"></div><div class="bar" id="b2_${f.id}"></div><div class="bar" id="b3_${f.id}"></div><div class="bar" id="b4_${f.id}"></div></div><span class="stxt" id="stxt_${f.id}"></span>`;
    wrap.appendChild(st);
    inp.addEventListener('input', ()=>checkStrength(inp.value, f.id));
  }

  const err = document.createElement('span');
  err.className = 'errtxt'; err.id = 'err_'+f.id;
  wrap.appendChild(err);
  return wrap;
}

function checkStrength(val, id){
  const bars = [1,2,3,4].map(i=>document.getElementById(`b${i}_${id}`));
  const txt = document.getElementById(`stxt_${id}`);
  if(!bars[0]) return;
  bars.forEach(b=>{b.className='bar';});
  if(!val){txt.textContent='';return;}
  let s=0;
  if(val.length>=8) s++;
  if(/[A-Z]/.test(val)) s++;
  if(/[0-9]/.test(val)) s++;
  if(/[^A-Za-z0-9]/.test(val)) s++;
  const cls=['weak','fair','good','strong'][s-1]||'weak';
  const lbl=['Weak','Fair','Good','Strong'][s-1]||'';
  for(let i=0;i<s;i++) bars[i].classList.add(cls);
  txt.textContent = s ? 'Strength: '+lbl : '';
}

function toggleEye(inputId, svgId){
  const inp = document.getElementById(inputId);
  const svg = document.getElementById(svgId);
  if(inp.type==='password'){
    inp.type='text';
    svg.innerHTML='<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  } else {
    inp.type='password';
    svg.innerHTML='<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  }
}

// ═══════════ UPDATED FOR BACKEND DATABASE CONNECTION ═══════════
async function handleSubmit(){
  const r = ROLES[currentRole]; 
  let ok = true;
  
  document.querySelectorAll('#dynFields .errtxt').forEach(e=>e.classList.remove('show'));
  document.querySelectorAll('#dynFields input').forEach(i=>i.classList.remove('err'));
  
  // 1. Client-Side Validation Loop
  r.fields.forEach(f=>{
    const inp = document.getElementById(f.id);
    const err = document.getElementById('err_'+f.id);
    if(!inp) return;
    const val = inp.value.trim();
    if(!val){
      err.textContent = f.label+' is required.';
      err.classList.add('show'); inp.classList.add('err'); ok=false;
    } else if(f.id==='cpw'){
      const pw = document.getElementById('pw');
      if(pw && inp.value!==pw.value){
        err.textContent='Passwords do not match.';
        err.classList.add('show'); inp.classList.add('err'); ok=false;
      }
    } else if(f.id==='pw' && val.length<8){
      err.textContent='Password must be at least 8 characters.';
      err.classList.add('show'); inp.classList.add('err'); ok=false;
    }
  });

  if(!document.getElementById('terms').checked){
    alert('Please agree to the Terms of Service to continue.'); 
    ok = false;
  }
  
  if(!ok) return;

  // 2. Gather form values into a payload object
  const formData = {
    role: currentRole
  };
  
  r.fields.forEach(f => {
    const inp = document.getElementById(f.id);
    if(inp && f.id !== 'cpw') { // No need to send confirm-password to backend
      formData[f.id] = inp.value.trim();
    }
  });

  // 3. Send Registration Payload to Node.js backend
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (response.ok && result.success) {
      const fn = document.getElementById('fn')?.value || '';
      document.getElementById('smsg').textContent =
        `Welcome, ${fn}! Your ${r.label} account has been successfully created on Rwanda EduConnect.`;
      document.getElementById('soverlay').classList.add('show');
    } else {
      alert(result.message || 'Registration failed.');
    }
  } catch (error) {
    console.error('Network Error:', error);
    alert('Could not establish a connection to the server.');
  }
}