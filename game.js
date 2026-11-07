const questions = [
  {category:'antiguo',icon:'⌂',question:'¿Quién construyó un arca para salvar a su familia y a los animales?',options:['Abraham','Noé','Moisés','David'],answer:'Noé',reference:'Génesis 6:13–22',explanation:'Dios pidió a Noé que construyera el arca antes del diluvio.'},
  {category:'antiguo',icon:'☼',question:'¿Qué mar se abrió para que el pueblo de Israel pudiera escapar de Egipto?',options:['Mar Muerto','Mar de Galilea','Mar Rojo','Mar Mediterráneo'],answer:'Mar Rojo',reference:'Éxodo 14:21–22',explanation:'Moisés extendió su mano y el Señor abrió un camino en el mar.'},
  {category:'antiguo',icon:'♩',question:'¿Qué joven pastor derrotó al gigante Goliat?',options:['Salomón','Samuel','David','Josué'],answer:'David',reference:'1 Samuel 17:45–50',explanation:'David venció a Goliat con una honda y una piedra, confiando en Dios.'},
  {category:'antiguo',icon:'✦',question:'¿Cuántos días y noches llovió durante el diluvio?',options:['7','12','40','100'],answer:'40',reference:'Génesis 7:12',explanation:'La lluvia cayó sobre la tierra durante cuarenta días y cuarenta noches.'},
  {category:'antiguo',icon:'☁',question:'¿En qué monte recibió Moisés los Diez Mandamientos?',options:['Monte Carmelo','Monte Sinaí','Monte de los Olivos','Monte Ararat'],answer:'Monte Sinaí',reference:'Éxodo 19:20; 20:1–17',explanation:'Dios entregó sus mandamientos a Moisés en el monte Sinaí.'},
  {category:'antiguo',icon:'♜',question:'¿Qué profeta fue tragado por un gran pez?',options:['Elías','Isaías','Jonás','Jeremías'],answer:'Jonás',reference:'Jonás 1:17',explanation:'Jonás estuvo dentro del gran pez tres días y tres noches.'},
  {category:'antiguo',icon:'♛',question:'¿Qué pidió Salomón a Dios cuando llegó a ser rey?',options:['Riquezas','Una larga vida','Sabiduría','Un gran ejército'],answer:'Sabiduría',reference:'1 Reyes 3:9–12',explanation:'Salomón pidió sabiduría para gobernar bien al pueblo.'},
  {category:'antiguo',icon:'♧',question:'¿Quién interpretó los sueños del faraón en Egipto?',options:['José','Daniel','Aarón','Jacob'],answer:'José',reference:'Génesis 41:14–16, 25–32',explanation:'José explicó que los sueños anunciaban siete años de abundancia y siete de hambre.'},
  {category:'nuevo',icon:'✧',question:'¿En qué ciudad nació Jesús?',options:['Nazaret','Jerusalén','Belén','Capernaúm'],answer:'Belén',reference:'Lucas 2:4–7',explanation:'Jesús nació en Belén, la ciudad de David.'},
  {category:'nuevo',icon:'♧',question:'¿Cuál fue el primer milagro de Jesús, según el Evangelio de Juan?',options:['Sanó a un ciego','Convirtió agua en vino','Calmó una tormenta','Multiplicó los panes'],answer:'Convirtió agua en vino',reference:'Juan 2:1–11',explanation:'En las bodas de Caná, Jesús convirtió el agua en vino.'},
  {category:'nuevo',icon:'♧',question:'¿Cuántos discípulos escogió Jesús?',options:['7','10','12','40'],answer:'12',reference:'Lucas 6:12–16',explanation:'Jesús llamó a doce discípulos para que estuvieran con él y fueran enviados.'},
  {category:'nuevo',icon:'♡',question:'¿Quién negó conocer a Jesús tres veces?',options:['Juan','Pedro','Tomás','Andrés'],answer:'Pedro',reference:'Lucas 22:54–62',explanation:'Pedro recordó las palabras de Jesús y lloró amargamente.'},
  {category:'nuevo',icon:'♧',question:'¿Qué hizo el buen samaritano por el hombre herido?',options:['Lo llevó a una posada y lo cuidó','Lo dejó con los sacerdotes','Le dio una moneda y siguió','Llamó a los soldados'],answer:'Lo llevó a una posada y lo cuidó',reference:'Lucas 10:30–35',explanation:'El samaritano tuvo compasión, curó sus heridas y pagó para que lo cuidaran.'},
  {category:'nuevo',icon:'♧',question:'¿Qué discípulo caminó sobre el agua hacia Jesús?',options:['Santiago','Felipe','Pedro','Mateo'],answer:'Pedro',reference:'Mateo 14:28–31',explanation:'Pedro salió de la barca y caminó sobre el agua hacia Jesús.'},
  {category:'nuevo',icon:'☼',question:'¿Qué alimento compartió Jesús para alimentar a cinco mil personas?',options:['Siete panes y dos peces','Cinco panes y dos peces','Cinco panes y cinco peces','Doce panes y un pez'],answer:'Cinco panes y dos peces',reference:'Mateo 14:17–21',explanation:'Jesús bendijo cinco panes y dos peces, y todos comieron hasta quedar satisfechos.'},
  {category:'nuevo',icon:'✉',question:'¿Quién escribió muchas cartas que aparecen en el Nuevo Testamento?',options:['Pablo','Herodes','Pilato','Zaqueo'],answer:'Pablo',reference:'Por ejemplo: Romanos 1:1',explanation:'Pablo escribió cartas a distintas comunidades cristianas para animarlas y enseñarles.'}
];

const screens = {home:document.querySelector('#homeScreen'),quiz:document.querySelector('#quizScreen'),result:document.querySelector('#resultScreen')};
const categoryNames = {all:'UN POCO DE TODO',antiguo:'ANTIGUO TESTAMENTO',nuevo:'NUEVO TESTAMENTO'};
let selectedCategory = 'all';
let round = [];
let current = 0;
let score = 0;
let correctAnswers = 0;
let streak = 0;
let bestStreak = 0;
let locked = false;
let soundOn = false;
let audioContext;

const bestScoreKey = 'retoDeFeBestScore';
const bestScoreEl = document.querySelector('#bestScore');
function getBestScore(){ return Number(localStorage.getItem(bestScoreKey) || 0); }
function refreshBestScore(){ const best=getBestScore(); bestScoreEl.textContent=best ? `${best} pts` : 'Aún sin récord'; }
function showScreen(name){ Object.values(screens).forEach(s=>s.classList.add('hidden')); screens[name].classList.remove('hidden'); window.scrollTo({top:0,behavior:'smooth'}); }
function showHome(){ showScreen('home'); refreshBestScore(); }
function shuffle(list){ const result=[...list]; for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result; }
function startGame(){
  const pool=questions.filter(q=>selectedCategory==='all'||q.category===selectedCategory);
  round=shuffle(pool).slice(0,5); current=0; score=0; correctAnswers=0; streak=0; bestStreak=0; locked=false;
  document.querySelector('#liveScore').textContent='0';
  document.querySelector('#quizCategory').textContent=categoryNames[selectedCategory];
  showScreen('quiz'); renderQuestion();
}
function renderQuestion(){
  locked=false;
  const q=round[current];
  document.querySelector('#questionCount').textContent=`PREGUNTA ${current+1} DE ${round.length}`;
  document.querySelector('#progressFill').style.width=`${(current/round.length)*100}%`;
  document.querySelector('#questionIcon').textContent=q.icon;
  document.querySelector('#questionText').textContent=q.question;
  document.querySelector('#questionHint').textContent='Elige la respuesta correcta';
  document.querySelector('#streakLabel').textContent=streak>1?`⚡ Racha de ${streak}`:'✧ ¡A por ello!';
  const answers=document.querySelector('#answers'); answers.innerHTML='';
  const letters=['A','B','C','D'];
  shuffle(q.options).forEach((option,index)=>{
    const button=document.createElement('button'); button.className='answer'; button.type='button';
    const letter=document.createElement('span');letter.className='letter';letter.textContent=letters[index];
    const text=document.createElement('span');text.textContent=option;
    button.append(letter,text);button.addEventListener('click',()=>chooseAnswer(button,option,q));answers.append(button);
  });
  const feedback=document.querySelector('#feedback');feedback.textContent='';feedback.classList.remove('incorrect');
  const next=document.querySelector('#nextButton');next.disabled=true;next.innerHTML=current===round.length-1?'Ver resultado <span>→</span>':'Siguiente pregunta <span>→</span>';
}
function chooseAnswer(button,option,q){
  if(locked)return;locked=true;
  const buttons=[...document.querySelectorAll('.answer')];buttons.forEach(b=>b.disabled=true);
  const feedback=document.querySelector('#feedback');
  if(option===q.answer){
    correctAnswers++;streak++;bestStreak=Math.max(bestStreak,streak);const earned=100+Math.max(0,streak-1)*25;score+=earned;
    button.classList.add('correct');feedback.textContent=`¡Correcto! +${earned} puntos · ${q.explanation} (${q.reference})`;feedback.classList.remove('incorrect');playTone(true);
  }else{
    streak=0;button.classList.add('wrong');const right=buttons.find(b=>b.lastElementChild.textContent===q.answer);if(right)right.classList.add('correct');feedback.textContent=`La respuesta era ${q.answer}. ${q.explanation} (${q.reference})`;feedback.classList.add('incorrect');playTone(false);
  }
  document.querySelector('#liveScore').textContent=score;
  document.querySelector('#streakLabel').textContent=streak>1?`⚡ Racha de ${streak}`:'✧ Sigue aprendiendo';
  document.querySelector('#nextButton').disabled=false;
}
function nextQuestion(){if(!locked)return;current++;if(current>=round.length){finishGame();return;}renderQuestion();}
function finishGame(){
  document.querySelector('#progressFill').style.width='100%';
  const previous=getBestScore();if(score>previous)localStorage.setItem(bestScoreKey,String(score));refreshBestScore();
  document.querySelector('#finalScore').textContent=score;
  document.querySelector('#correctCount').textContent=`${correctAnswers} de ${round.length} correctas`;
  document.querySelector('#accuracyStat').textContent=`${Math.round(correctAnswers/round.length*100)}%`;
  document.querySelector('#bestStreak').textContent=bestStreak;
  const title=document.querySelector('#resultTitle'),message=document.querySelector('#resultMessage'),medal=document.querySelector('#resultMedal');
  if(correctAnswers===5){title.textContent='¡Excelente!';message.textContent='¡Lo tienes! Tu conocimiento bíblico está brillando.';medal.textContent='✦';}
  else if(correctAnswers>=3){title.textContent='¡Muy bien!';message.textContent='Vas por buen camino. Cada reto te enseña algo nuevo.';medal.textContent='✝';}
  else{title.textContent='¡Buen comienzo!';message.textContent='Sigue explorando estas historias. ¡Cada día puedes aprender más!';medal.textContent='♡';}
  if(score>previous&&score>0)toast('¡Nuevo récord personal!');
  showScreen('result');
}
function playTone(correct){if(!soundOn)return;try{audioContext=audioContext||new(window.AudioContext||window.webkitAudioContext)();const osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.connect(gain);gain.connect(audioContext.destination);osc.frequency.value=correct?660:245;gain.gain.setValueAtTime(.08,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.22);osc.start();osc.stop(audioContext.currentTime+.22);}catch(e){}}
let toastTimer;
function toast(message){const el=document.querySelector('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2100);}

document.querySelectorAll('.category-card').forEach(button=>button.addEventListener('click',()=>{selectedCategory=button.dataset.category;document.querySelectorAll('.category-card').forEach(card=>card.classList.toggle('active',card===button));}));
document.querySelector('#startButton').addEventListener('click',startGame);
document.querySelector('#nextButton').addEventListener('click',nextQuestion);
document.querySelector('#quitButton').addEventListener('click',()=>{if(confirm('¿Quieres salir del reto? Se perderá el progreso de esta partida.'))showHome();});
document.querySelector('#playAgain').addEventListener('click',startGame);
document.querySelector('#homeButton').addEventListener('click',showHome);
document.querySelector('#soundToggle').addEventListener('click',event=>{soundOn=!soundOn;event.currentTarget.classList.toggle('sound-on',soundOn);event.currentTarget.setAttribute('aria-label',soundOn?'Desactivar sonido':'Activar sonido');event.currentTarget.title=soundOn?'Desactivar sonido':'Activar sonido';toast(soundOn?'Sonido activado':'Sonido desactivado');});
refreshBestScore();