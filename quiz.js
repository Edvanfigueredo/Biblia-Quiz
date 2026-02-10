import {gerarPoolPerguntas,criarPergunta} from "./questionGenerator.js";

let pool=[];
let atual=null;
let tentativas=0;

export async function iniciarQuizEngine(){
pool=await gerarPoolPerguntas();
novaPergunta();
}

export function novaPergunta(){

let v;
do{
v=pool[Math.floor(Math.random()*pool.length)];
}while(Sessao.usadas.has(v.cap+":"+v.ver));

Sessao.usadas.add(v.cap+":"+v.ver);

atual=criarPergunta(v);
tentativas=0;
render();
}

function render(){
q.innerText=atual.pergunta+" ("+atual.ref+")";
alts.innerHTML="";

atual.alts.forEach((t,i)=>{
const d=document.createElement("div");
d.className="alt";
d.innerText=t;
d.onclick=()=>resp(i,d);
alts.appendChild(d);
});
}

function resp(i,el){
tentativas++;

if(i===atual.correta){
el.classList.add("correta");
ranking.acertos++;
ranking.pontos+=10;
setTimeout(novaPergunta,1200);
}else{
el.classList.add("errada");
ranking.erros++;
if(tentativas>=2){
document.querySelectorAll(".alt")[atual.correta]
.classList.add("correta");
alert("Você errou");
}
}
}