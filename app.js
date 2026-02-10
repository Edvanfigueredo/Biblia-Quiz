let versos = [];
let perguntasGeradas = [];
let usadas = new Set();
let atual = null;
let tentativas = 0;

/* ===================== */

async function carregarBiblia(){

try{

const controller = new AbortController();
setTimeout(()=>controller.abort(), 5000);

const r = await fetch("bible.txt", {
signal: controller.signal
});

if(!r.ok) throw "arquivo não encontrado";

const t = await r.text();

versos = t.split("\n")
.filter(l => l.match(/\d+:\d+/));

console.log("Versos carregados:", versos.length);

if(versos.length < 100){
throw "bible.txt inválido";
}

}catch(e){

console.error("Falha bible.txt:", e);

/* fallback mínimo para não travar */

versos = [
"Mateus 27:24 Pilatos entregou Jesus",
"Gênesis 6:14 Noé construiu a arca",
"Êxodo 14:21 Moisés abriu o mar"
];

alert("⚠️ bible.txt não carregou — usando modo básico");
}
}

/* ===================== */

function gerarPerguntas(){

perguntasGeradas = versos.map(v=>{

const m = v.match(/^(\w+)\s(\d+:\d+)/);
if(!m) return null;

return {
ref: m[2],
livro: m[1],
p: `Em qual livro está o versículo ${m[2]}?`
};

}).filter(Boolean);

console.log("Perguntas:", perguntasGeradas.length);
}

/* ===================== */

function alternativas(correta){

const livros=[
"Gênesis","Êxodo","Salmos","Isaías",
"Mateus","Marcos","Lucas","João","Atos","Romanos"
];

const s=new Set([correta]);
while(s.size<5){
s.add(livros[Math.random()*livros.length|0]);
}

return [...s].sort(()=>Math.random()-0.5);
}

/* ===================== */

async function iniciarQuiz(){

ola.innerText += "\n⏳ Preparando perguntas...";

await carregarBiblia();
gerarPerguntas();

if(perguntasGeradas.length === 0){
alert("Erro ao gerar perguntas");
return;
}

novaPergunta();
}

/* ===================== */

function novaPergunta(){

tentativas=0;
feedback.innerText="";

let p;

do{
p = perguntasGeradas[
Math.random()*perguntasGeradas.length|0
];
}while(usadas.has(p.ref));

usadas.add(p.ref);

const alts = alternativas(p.livro);

atual = {
...p,
alts,
c: alts.indexOf(p.livro)
};

q.innerText = p.p;

altsDiv.innerHTML="";

alts.forEach((t,i)=>{
const d=document.createElement("div");
d.className="alt";
d.innerText=t;
d.onclick=()=>responder(i,d);
altsDiv.appendChild(d);
});
}

/* ===================== */

function responder(i,el){

tentativas++;

if(i===atual.c){

el.classList.add("correta","pop");
feedback.innerText="🎉 Correto!";
feedback.style.color="#4caf50";

setTimeout(novaPergunta,1000);

}else{

el.classList.add("errada");

if(tentativas>=2){
document.querySelectorAll(".alt")[atual.c]
.classList.add("correta");

feedback.innerText="📖 Agora você já sabe!";
feedback.style.color="#ffcc80";
}else{
feedback.innerText="Quase!";
}
}
}
