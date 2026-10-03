/* Larissa Fit: contas individuais, sem acesso aos dados de outras pessoas. */
(() => {
const enabled=new URLSearchParams(location.search).get('perfil')==='1';
if(!enabled)return;
const manifest=document.querySelector('link[rel="manifest"]');if(manifest)manifest.href='profiles.webmanifest';
const URL_BASE='https://oripkyichxkrihnaxbwe.supabase.co';
const KEY='sb_publishable_zB9SfLDFMQyIYnzaIJ-bNA_AtKEUO5p';
const TOKEN_KEY='larissaFitAuth';
let token=null,user=null,plans=[],ready=false,saving=Promise.resolve();
const originalRender=render;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const panel=document.createElement('section');panel.className='card';panel.id='fitAccount';
document.querySelector('.topbar').after(panel);
const protectedMain=document.querySelector('main');protectedMain.hidden=true;
document.querySelector('.bottom').hidden=true;
panel.innerHTML=`<h2>Seu espaço no Larissa Fit</h2><p class="muted">Entre para preencher sua anamnese e acessar seu treino individual.</p><form id="fitLogin"><label>E-mail<input id="fitEmail" type="email" autocomplete="email" required></label><label>Senha<input id="fitPassword" type="password" autocomplete="current-password" minlength="8" required></label><button class="primary" type="submit">Entrar</button><button type="button" id="fitSignup" class="primary">Criar conta</button></form><p id="fitMessage" role="status" class="muted"></p>`;
function message(s){document.getElementById('fitMessage').textContent=s}
function persistToken(t){token=t;if(t){t.expires_at=t.expires_at||Math.floor(Date.now()/1000)+(t.expires_in||3600);sessionStorage.setItem(TOKEN_KEY,JSON.stringify(t))}else sessionStorage.removeItem(TOKEN_KEY)}
async function api(path,options={},auth=true){
 if(auth&&!token)throw Error('Entre na sua conta novamente.');
 if(auth&&token.expires_at<Date.now()/1000+60){const t=await api('/auth/v1/token?grant_type=refresh_token',{method:'POST',body:JSON.stringify({refresh_token:token.refresh_token})},false);persistToken(t)}
 const r=await fetch(URL_BASE+path,{...options,headers:{apikey:KEY,'Content-Type':'application/json',...(auth?{Authorization:'Bearer '+token.access_token}:{}),...options.headers}});
 const text=await r.text();let data;try{data=text?JSON.parse(text):null}catch{data=null}
 if(!r.ok){if(r.status===401)throw Error('Sessão expirada ou e-mail e senha incorretos. Entre novamente.');throw Error(data?.msg||data?.message||data?.error_description||'Não foi possível concluir. Tente novamente.')}
 return data;
}
function resetState(){Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,{plan:3,phase:1,week:1,waterGoal:2000,water:{},workoutHistory:[],loads:{},bodyEntries:[],settings:{interval:0,start:'08:00',end:'22:00'},lastDuration:60})}
function parsePlans(rows){return (rows[0]?.workouts||[]).map((p,i)=>({name:escape(p.name||'Treino '+(i+1)),index:i,ex:(p.ex||[]).map((x,j)=>{const base=EX[x.id]||{};return {id:x.id||'custom'+j,...base,...Object.fromEntries(['name','subtitle','sets','rest','how','breath'].map(k=>[k,escape(x[k]??base[k]??'')]))}})})).filter(w=>w.ex.length)}
async function loadAccount(){
 ready=false;user=await api('/auth/v1/user');
 const id=encodeURIComponent(user.id);
 const [a,p,g]=await Promise.all([api('/rest/v1/fit_assessments?user_id=eq.'+id),api('/rest/v1/fit_plans?user_id=eq.'+id),api('/rest/v1/fit_progress?user_id=eq.'+id)]);
 resetState();const data=g[0]?.data||{};for(const k of ['water','workoutHistory','loads','bodyEntries','settings','waterGoal','lastDuration'])if(data[k]!==undefined)S[k]=data[k];
 plans=parsePlans(p);S.plan=plans.length||3;
 const answers=a[0]?.answers||{};
 document.getElementById('fitLogin').hidden=true;
 if(!document.getElementById('fitAssessment')){
 const box=document.createElement('div');box.innerHTML=`<p id="fitIdentity" class="muted"></p><button type="button" id="fitLogout">Sair da conta</button><details id="fitDetails" open><summary><strong>Minha anamnese</strong></summary><form id="fitAssessment"><label>Nome<input name="name" required maxlength="80"></label><label>Idade<input name="age" type="number" min="18" max="100" required></label><label>Objetivo<select name="goal"><option>Ganhar força e condicionamento</option><option>Emagrecimento</option><option>Ganhar massa muscular</option><option>Criar uma rotina</option></select></label><label>Experiência<select name="level"><option>Iniciante</option><option>Intermediário</option><option>Avançado</option><option>Voltando após uma pausa</option></select></label><div class="grid2"><label>Dias por semana<input name="days" type="number" min="1" max="6" value="3" required></label><label>Minutos por treino<input name="minutes" type="number" min="15" max="120" value="60" required></label></div><label>Local e equipamentos disponíveis<input name="equipment" required maxlength="1000"></label><label>Rotina e preferências<input name="routine" maxlength="1000"></label><label>Dores, lesões, cirurgias e restrições<input name="limitations" maxlength="1500" placeholder="Se não houver, escreva nenhuma"></label><label>Recomendações de um profissional<input name="guidance" maxlength="1500"></label><label><input type="checkbox" required style="width:auto"> Autorizo o uso das respostas para preparar minha ficha e entendo que informações de saúde são opcionais.</label><p class="muted small">Suas respostas ficam associadas à sua conta. Larissa poderá solicitar aqui a preparação da ficha; não há geração automática. Sugestões precisam de revisão profissional.</p><button type="submit" class="primary full">Salvar anamnese</button></form></details><p id="fitPlanStatus" class="note"></p><button id="fitReload" type="button">Atualizar minha ficha</button>`;panel.insertBefore(box,document.getElementById('fitMessage'));
 document.getElementById('fitAssessment').onsubmit=async e=>{e.preventDefault();const button=e.target.querySelector('button');button.disabled=true;try{const answers=Object.fromEntries(new FormData(e.target));await api('/rest/v1/fit_assessments?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates'},body:JSON.stringify({user_id:user.id,answers,updated_at:new Date().toISOString()})});message('Anamnese salva. Sua ficha será preparada a partir dessas respostas.');document.getElementById('fitDetails').open=false}catch(x){message(x.message)}finally{button.disabled=false}};
 document.getElementById('fitLogout').onclick=async()=>{try{await saving;await api('/auth/v1/logout',{method:'POST'})}catch{}persistToken(null);location.reload()};
 document.getElementById('fitReload').onclick=async()=>{try{await saving;await loadAccount();message('Ficha atualizada.')}catch(x){message(x.message)}};
 }
 document.getElementById('fitIdentity').textContent='Conta: '+user.email;
 Object.entries(answers).forEach(([k,v])=>{const input=document.getElementById('fitAssessment').elements.namedItem(k);if(input)input.value=v});
 document.getElementById('fitDetails').open=!a.length;
 document.getElementById('fitPlanStatus').textContent=plans.length?'Sua ficha está disponível.':a.length?'Anamnese recebida. Seu treino está aguardando preparação.':'Preencha a anamnese para preparar seu treino.';
 protectedMain.hidden=!plans.length;document.querySelector('.bottom').hidden=!plans.length;
 document.getElementById('plan3').parentElement.hidden=true;
 document.documentElement.classList.add("fit-ready");ready=true;if(plans.length)render();message('');
}
workoutByIndex=i=>plans[Math.max(0,Math.min(i,plans.length-1))];
currentWorkout=()=>workoutByIndex(Math.min(plans.length-1,weeklyWorkoutCount()%Math.max(1,plans.length)));
renderWorkoutCards=()=>{$('workoutCards').innerHTML=plans.map((p,i)=>`<div class="hist"><strong>${i+1}. ${p.name}</strong><span>${p.ex.length} exercícios</span><button type="button" onclick="openSpecificWorkout(${i})">Abrir treino</button></div>`).join('')};
render=()=>{if(!plans.length)return;originalRender();$('phaseText').textContent='SUA FICHA INDIVIDUAL';$('phaseStat').textContent='Individual';$('weekStat').textContent='—'};
save=()=>{if(!ready||!user)return;const uid=user.id;const data=JSON.parse(JSON.stringify(S));message('Salvando seus registros…');saving=saving.catch(()=>{}).then(()=>api('/rest/v1/fit_progress?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates'},body:JSON.stringify({user_id:uid,data,updated_at:new Date().toISOString()})})).then(()=>message('Registros salvos.')).catch(x=>message('Falha ao salvar: '+x.message))};
$('plan3').onclick=$('plan5').onclick=()=>{};
document.getElementById('fitLogin').onsubmit=async e=>{e.preventDefault();await authenticate(false)};
document.getElementById('fitSignup').onclick=()=>{if(document.getElementById('fitLogin').reportValidity())authenticate(true)};
async function authenticate(signup){const buttons=panel.querySelectorAll('button');buttons.forEach(b=>b.disabled=true);message('Conectando…');try{const email=document.getElementById('fitEmail').value.trim(),password=document.getElementById('fitPassword').value;const t=await api(signup?'/auth/v1/signup':'/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})},false);document.getElementById('fitPassword').value='';if(!t.access_token){message('Conta criada. Confirme seu e-mail e depois volte a este link para entrar.');return}persistToken(t);await loadAccount()}catch(x){message(x.message)}finally{buttons.forEach(b=>b.disabled=false)}}
try{token=JSON.parse(sessionStorage.getItem(TOKEN_KEY)||'null')}catch{}
if(token)loadAccount().catch(x=>{persistToken(null);message(x.message)});
})();
