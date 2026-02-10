let versos = [];
let perguntasGeradas = [];
let usadas = new Set();
let atual = null;

/* ===================== */

async function carregarBiblia(){
const r = await fetch("bible.txt");
const t = await r.text();

versos = t.split("\n")
.filter(l => /\d+:\d+/.test(l));
}

/* ===================== */

function parseVerso(v){
const m = v.match(/^(.+?)\s(\d+:\d+)\s(.+)/);
if(!m) return null;

return {
livro:m[1],
ref:m[2],
texto:m[3]
};
}

/* ===================== */

function gerarPerguntas(){

perguntasGeradas = [];

const padroes = [
/^(\w+)\s+abriu\s+/i,
/^(\w+)\s+construiu\s+/i,
/^(\w+)\s+traiu\s+/i,
/^(\w+)\s+entregou\s+/i,
/^(\w+)\s+curou\s+/i,
/^(\w+)\s+ressuscitou\s+/i,
/^(\w+)\s+matou\s+/i,
/^(\w+)\s+libertou\s+/i
];

versos.forEach(v=>{

const p = parseVerso(v);
if(!p) return;

for(let r of padroes){

const m = p.texto.match(r);
if(m){

const nome = m[1];

perguntasGeradas.push({
pergunta: p.texto.replace(nome, "Quem").replace(/\.$/,"?"),
resposta: nome,
ref: `${p.livro} ${p.ref}`,
verso: p.texto
});

break;
}
}

});

console.log("Perguntas geradas:", perguntasGeradas.length);
}

/* ===================== */

function alternativas(correta){

const nomes = [...new Set(perguntasGeradas.map(p=>p.resposta))];
const s = new Set([correta]);

while(s.size<4){
s.add(nomes[Math.random()*nomes.length|0]);
}

return [...s].sort(()=>Math.random()-0.5);
}

/* ===================== */

async function iniciarQuiz(){

const nomeInput = document.getElementById("nome");
const religiaoSelect = document.getElementById("religiao");

if(!nomeInput || !religiaoSelect){
alert("Erro DOM");
return;
}

const nome = nomeInput.value || "Visitante";
document.getElementById("ola").innerText = `Olá ${nome}!`;

await carregarBiblia();
gerarPerguntas();

usadas.clear();
novaPergunta();
}

/* ===================== */

function novaPergunta(){

const btnProxima = document.getElementById("btnProxima");
const feedback = document.getElementById("feedback");
const q = document.getElementById("q");
const altsDiv = document.getElementById("altsDiv");

btnProxima.style.display="none";
feedback.innerHTML="";

if(usadas.size >= perguntasGeradas.length){
usadas.clear();
}

let p;

do{
p = perguntasGeradas[Math.random()*perguntasGeradas.length|0];
}while(usadas.has(p));

usadas.add(p);

const alts = alternativas(p.resposta);

atual = {
...p,
alts,
c: alts.indexOf(p.resposta)
};

q.innerText = p.pergunta;
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

const btnProxima = document.getElementById("btnProxima");
const feedback = document.getElementById("feedback");

document.querySelectorAll(".alt")
.forEach(x=>x.onclick=null);

document.querySelectorAll(".alt")[atual.c]
.classList.add("correta");

if(i===atual.c){
el.classList.add("correta");
feedback.innerHTML =
`✅ Correto!<br><b>${atual.resposta}</b><br>📖 ${atual.ref}<br><small>${atual.verso}</small>`;
}else{
el.classList.add("errada");
feedback.innerHTML =
`📖 Agora você já sabe:<br><b>${atual.resposta}</b><br>📖 ${atual.ref}<br><small>${atual.verso}</small>`;
}

btnProxima.style.display="block";
}
