
const programs = {
  3: [
    {name:"LEG + GLÚTEO + CORE",exercises:[
      ex("Leg press","Máquina de empurrar com as pernas","3x10–12","90s",
      "Sente com as costas apoiadas. Pés na largura dos ombros. Desça devagar sem tirar o quadril do banco e empurre de volta.",
      "Solte o ar enquanto empurra.","Agachamento com halter","Agachamento sentando e levantando do banco"),
      ex("Cadeira extensora","Extensão de joelho na máquina","3x12–15","75s",
      "Ajuste o apoio acima do tornozelo. Estenda as pernas sem dar tranco e volte devagar.","Solte o ar ao subir.","Agachamento com halter","Agachamento no banco"),
      ex("Stiff com halteres","Posterior de coxa e glúteo","3x10–12","90s",
      "Segure os halteres perto das pernas. Leve o quadril para trás com as costas neutras e volte apertando os glúteos.","Solte o ar ao subir.","Mesa flexora","Ponte de glúteo"),
      ex("Elevação de quadril","Glúteo no chão ou banco","3x12–15","75s",
      "Pés firmes no chão. Eleve o quadril sem arquear demais a lombar e desça controlando.","Solte o ar ao subir.","Ponte no chão","Hip thrust com halter"),
      ex("Dead bug","Core com braços e pernas alternados","3x8 cada lado","60s",
      "Deite de barriga para cima. Mantenha a lombar confortável e mova braço e perna opostos devagar.","Expire durante o movimento.","Marcha deitada","Bird dog"),
      ex("Vácuo abdominal","Controle do abdômen profundo","3x15–20s","45s",
      "Faça em pé ou deitada. Expire, puxe suavemente o abdômen para dentro e mantenha apenas enquanto estiver confortável.","Não force nem fique sem ar.","Respiração diafragmática","Ativação abdominal deitada")
    ]},
    {name:"COSTAS + BRAÇOS + CORE",exercises:[
      ex("Puxada alta","Puxada na frente na máquina/polia","3x10–12","90s",
      "Puxe a barra na direção da parte alta do peito mantendo o tronco estável. Volte devagar.","Solte o ar ao puxar.","Remada unilateral com halter","Remada sentada"),
      ex("Remada sentada","Puxada horizontal para costas","3x10–12","90s",
      "Puxe o pegador em direção ao abdômen sem jogar o corpo para trás. Aperte as costas e volte controlando.","Solte o ar ao puxar.","Remada com halter","Remada com elástico"),
      ex("Desenvolvimento com halteres","Ombros sentada","3x10–12","75s",
      "Comece com os halteres próximos aos ombros. Empurre para cima sem travar os cotovelos e volte.","Solte o ar ao subir.","Elevação lateral","Desenvolvimento na máquina"),
      ex("Rosca de bíceps","Braços com halteres","2x10–12","60s",
      "Cotovelos próximos ao corpo. Dobre os braços sem balançar o tronco e volte devagar.","Solte o ar ao subir.","Rosca alternada","Rosca na polia"),
      ex("Pallof press","Core anti-rotação","3x10 cada lado","60s",
      "Fique de lado para a polia/elástico. Empurre as mãos para frente sem deixar o tronco girar.","Solte o ar ao estender.","Bird dog","Dead bug")
    ]},
    {name:"LEG + GLÚTEO + CORE",exercises:[
      ex("Agachamento com halter","Agachamento segurando peso no peito","3x10–12","90s",
      "Pés confortáveis. Sente o quadril para trás e para baixo, mantendo os joelhos acompanhando a direção dos pés.","Solte o ar ao subir.","Agachamento no banco","Leg press"),
      ex("Step-up","Subida no banco ou degrau","3x8 cada perna","90s",
      "Suba usando a perna que está no banco, sem impulsionar demais com a perna de baixo. Desça devagar.","Solte o ar ao subir.","Leg press","Agachamento no banco"),
      ex("Stiff com halteres","Posterior de coxa e glúteo","3x10–12","90s",
      "Leve o quadril para trás mantendo os halteres perto das pernas. Volte apertando os glúteos.","Solte o ar ao subir.","Mesa flexora","Ponte de glúteo"),
      ex("Elevação de quadril","Glúteo","3x12–15","75s",
      "Eleve o quadril até alinhar tronco e coxas, sem exagerar na lombar.","Solte o ar ao subir.","Ponte no chão","Hip thrust"),
      ex("Bird dog","Core em quatro apoios","3x8 cada lado","60s",
      "Em quatro apoios, estenda braço e perna opostos sem girar o quadril. Volte devagar.","Expire ao estender.","Dead bug","Marcha deitada")
    ]}
  ],
  5: []
};

function ex(name, subtitle, sets, rest, how, breath, alt1, alt2){
  return {name, subtitle, sets, rest, how, breath, alternatives:[alt1,alt2]};
}

programs[5] = [
  {name:"LEG",exercises:[programs[3][0].exercises[0],programs[3][0].exercises[1],programs[3][2].exercises[0],programs[3][0].exercises[2]]},
  {name:"COSTAS + BRAÇOS",exercises:programs[3][1].exercises.slice(0,4)},
  {name:"GLÚTEO + CORE",exercises:[programs[3][0].exercises[3],programs[3][2].exercises[2],programs[3][2].exercises[4],programs[3][0].exercises[4]]},
  {name:"SUPERIOR",exercises:[programs[3][1].exercises[0],programs[3][1].exercises[1],programs[3][1].exercises[2],programs[3][1].exercises[3],programs[3][1].exercises[4]]},
  {name:"LEG + GLÚTEO",exercises:[programs[3][2].exercises[0],programs[3][2].exercises[1],programs[3][2].exercises[2],programs[3][2].exercises[3]]},
];

const state = JSON.parse(localStorage.getItem("larissaFit") || "{}");
state.plan = state.plan || 3;
state.phase = state.phase || 1;
state.week = state.week || 1;
state.waterGoal = state.waterGoal || 2000;
state.water = state.water || {};
state.workoutHistory = state.workoutHistory || [];
state.loads = state.loads || {};
state.settings = state.settings || {interval:90,start:"08:00",end:"22:00"};
save();

function save(){localStorage.setItem("larissaFit",JSON.stringify(state))}
function keyToday(){return new Date().toISOString().slice(0,10)}
function waterToday(){return state.water[keyToday()] || 0}
function setWater(v){state.water[keyToday()] = Math.max(0,v); save(); render()}
function weekdayIndex(){
  const d=new Date().getDay();
  if(state.plan===3) return d<=1?0:d<=3?1:2;
  return Math.min(4,Math.max(0,d-1));
}
function currentWorkout(){return programs[state.plan][weekdayIndex()]}

function render(){
  const w=currentWorkout();
  document.getElementById("workoutName").textContent=w.name;
  document.getElementById("workoutMeta").textContent=`${w.exercises.length} exercícios • ~${state.plan===3?40:35} min`;
  document.getElementById("planPill").textContent=`${state.plan}x por semana`;
  document.getElementById("phaseText").textContent=`FASE ${state.phase} • SEMANA ${state.week}/4`;
  document.getElementById("phaseStat").textContent=`${state.phase} / 3`;
  document.getElementById("weekStat").textContent=`${state.week} / 4`;
  document.getElementById("waterGoal").textContent=state.waterGoal;
  document.getElementById("waterNow").textContent=waterToday();
  const pct=Math.min(100,Math.round(waterToday()/state.waterGoal*100));
  document.getElementById("waterPct").textContent=`${pct}%`;
  document.getElementById("waterBar").style.width=pct+"%";
  document.getElementById("plan3Btn").classList.toggle("active",state.plan===3);
  document.getElementById("plan5Btn").classList.toggle("active",state.plan===5);
  document.getElementById("weeklyWorkouts").textContent=`${weeklyWorkoutCount()} / ${state.plan}`;
  document.getElementById("weeklyWater").textContent=`${weeklyWaterGoalDays()} dias`;
}
function weeklyWorkoutCount(){
  const now=new Date(), start=new Date(now); start.setDate(now.getDate()-((now.getDay()+6)%7)); start.setHours(0,0,0,0);
  return state.workoutHistory.filter(x=>new Date(x.date)>=start).length;
}
function weeklyWaterGoalDays(){
  const now=new Date(), start=new Date(now); start.setDate(now.getDate()-((now.getDay()+6)%7)); start.setHours(0,0,0,0);
  let n=0;
  for(let i=0;i<7;i++){const d=new Date(start);d.setDate(start.getDate()+i); const k=d.toISOString().slice(0,10);if((state.water[k]||0)>=state.waterGoal)n++}
  return n;
}

document.querySelectorAll("[data-water]").forEach(b=>b.onclick=()=>setWater(waterToday()+Number(b.dataset.water)));
document.getElementById("undoWater").onclick=()=>setWater(waterToday()-200);
document.getElementById("plan3Btn").onclick=()=>{state.plan=3;save();render()};
document.getElementById("plan5Btn").onclick=()=>{state.plan=5;save();render()};

const workoutDialog=document.getElementById("workoutDialog");
document.getElementById("startWorkoutBtn").onclick=()=>openWorkout();
function openWorkout(){
  const w=currentWorkout();
  document.getElementById("dialogWorkoutName").textContent=w.name;
  const list=document.getElementById("exerciseList");
  list.innerHTML="";
  w.exercises.forEach((e,i)=>{
    const key=`${state.phase}-${state.plan}-${w.name}-${e.name}`;
    const load=state.loads[key]||"";
    const el=document.createElement("div");
    el.className="exercise";
    el.innerHTML=`
      <h3>${i+1}. ${e.name}</h3>
      <div class="meta">${e.subtitle}</div>
      <div style="margin-top:8px"><span class="badge">${e.sets}</span><span class="badge">Descanso ${e.rest}</span></div>
      <details><summary>Como fazer</summary><p>${e.how}</p><p><strong>Respiração:</strong> ${e.breath}</p><div class="note">Se ficar sem fôlego, pare, recupere a respiração e retome. Não precisa correr entre as séries.</div></details>
      <details><summary>Não tem esse aparelho?</summary><p>${e.alternatives.join(" • ")}</p></details>
      <div class="exercise-grid">
        <label>Carga (kg)<input data-load="${key}" type="number" inputmode="decimal" value="${load}" placeholder="Ex.: 20"></label>
        <label>Como ficou?
          <select data-feel="${key}">
            <option>Na medida</option><option>Muito fácil</option><option>Muito pesado</option><option>Fiquei sem fôlego</option><option>Senti dor</option>
          </select>
        </label>
      </div>`;
    list.appendChild(el);
  });
  list.querySelectorAll("[data-load]").forEach(inp=>inp.onchange=()=>{state.loads[inp.dataset.load]=inp.value;save()});
  workoutDialog.showModal();
}
document.getElementById("finishWorkoutBtn").onclick=()=>{
  const w=currentWorkout();
  state.workoutHistory.push({date:new Date().toISOString(), workout:w.name, plan:state.plan,phase:state.phase,week:state.week});
  save(); workoutDialog.close(); render(); alert("Treino registrado 💪");
};

const settingsDialog=document.getElementById("settingsDialog");
document.getElementById("settingsBtn").onclick=()=>{
  waterGoalInput.value=state.waterGoal;
  reminderInterval.value=state.settings.interval;
  reminderStart.value=state.settings.start;
  reminderEnd.value=state.settings.end;
  settingsDialog.showModal();
};
document.getElementById("saveSettings").onclick=async()=>{
  state.waterGoal=Number(waterGoalInput.value)||2000;
  state.settings={interval:Number(reminderInterval.value),start:reminderStart.value,end:reminderEnd.value};
  save();
  if(state.settings.interval>0 && "Notification" in window){
    try{await Notification.requestPermission()}catch(e){}
  }
  settingsDialog.close(); render();
};

setInterval(()=>{
  if(!state.settings.interval || !("Notification" in window) || Notification.permission!=="granted") return;
  const now=new Date();
  const mins=now.getHours()*60+now.getMinutes();
  const [sh,sm]=state.settings.start.split(":").map(Number), [eh,em]=state.settings.end.split(":").map(Number);
  const start=sh*60+sm,end=eh*60+em;
  if(mins<start||mins>end) return;
  const last=Number(localStorage.getItem("lastWaterReminder")||0);
  if(Date.now()-last>=state.settings.interval*60000){
    const missing=Math.max(0,state.waterGoal-waterToday());
    new Notification("💧 Hora da água",{body:missing?`Faltam ${missing} ml para sua meta de hoje.`:"Meta batida! Continue se hidratando conforme sua necessidade."});
    localStorage.setItem("lastWaterReminder",Date.now());
  }
},60000);

render();
if("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js").catch(()=>{})}
