let versos = [];
let perguntasGeradas = [];
let usadas = new Set();
let atual = null;

/* ===================== */

const NT = ["Mateus","Marcos","Lucas","João","Atos","Romanos"];
const AT_SABEDORIA = ["Salmos","Provérbios","Eclesiastes"];
const AT_PROFETAS = ["Isaías","Jeremias","Ezequiel","Daniel"];

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

function filtrarReligiao(livro, religiao){

switch(religiao){

case "Budismo":
return AT_SABEDORIA.includes(livro);

case "Espiritismo":
return NT.includes(livro);

case "Umbanda":
return AT_PROFETAS.includes(livro) || AT_SABEDORIA.includes(livro);

case "Candomblé":
return AT_PROFETAS.includes(livro);

case "Ateu":
return true;

default:
return true;
}
}

/* ===================== */

function gerarPerguntas(religiao){

perguntasGeradas = [];

const padroes = [

/^(\w+)\s+abriu\s+(.+)/i,
/^(\w+)\s+construiu\s+(.+)/i,
/^(\w+)\s+traiu\s+(.+)/i,
/^(\w+)\s+entregou\s+(.+)/i,
/^(\w+)\s+curou\s+(.+)/i,
/^(\w+)\s+ressuscitou\s+(.+)/i,
/^(\w+)\s+matou\s+(.+)/i,
/^(\w+)\s+libertou\s+(.+)/i,
/^(\w+)\s+disse\s+(.+)/i,
/^(\w+)\s+fez\s+(.+)/i
];

versos.forEach(v=>{

const p = parseVerso(v);
if(!p) return;
if(!filtrarReligiao(p.livro, religiao)) return;

for(let r of padroes){

const m = p.texto.match(r);

if(m){

perguntasGeradas.push({

pergunta: `Quem ${m[0].replace(m[1]+" ","")}?`,
resposta: m[1],
ref: `${p.livro} ${p.ref}`,
verso: p.texto

});

break;
}
}

});

perguntasGeradas = perguntasGeradas.slice(0,600);

console.log("Perguntas geradas:", perguntasGeradas.length);
}

/* ===================== */

function alternativas(correta){

const nomes = [...new Set(perguntasGeradas.map(p=>p.resposta))];

const s = new Set([correta]);

while(s.size<5){
s.add(nomes[Math.random()*nomes.length|0]);
}

return [...s].sort(()=>Math.random()-0.5);
}

/* ===================== */

async function iniciarQuiz(){

const nome = nomeInput.value;
const religiao = religiaoSelect.value;

ola.innerText = `Olá ${nome}!`;

await carregarBiblia();
gerarPerguntas(religiao);

usadas.clear();

novaPergunta();
}

/* ===================== */

function novaPergunta(){

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

document.querySelectorAll(".alt")
.forEach(x=>x.onclick=null);

const corretaEl =
document.querySelectorAll(".alt")[atual.c];

corretaEl.classList.add("correta");

if(i===atual.c){

el.classList.add("correta");

feedback.innerHTML = `
✅ Correto!<br>
<b>${atual.resposta}</b><br>
📖 ${atual.ref}<br>
<small>${atual.verso}</small>
`;

}else{

el.classList.add("errada");

feedback.innerHTML = `
📖 Agora você já sabe:<br>
<b>${atual.resposta}</b><br>
📖 ${atual.ref}<br>
<small>${atual.verso}</small>
`;
}

btnProxima.style.display="block";
}

/* ===================== */

const nomeInput = document.getElementById("nome");
const religiaoSelect = document.getElementById("religiao");
const q = document.getElementById("q");
const altsDiv = document.getElementById("altsDiv");
const feedback = document.getElementById("feedback");
const btnProxima = document.getElementById("btnProxima");
const ola = document.getElementById("ola");
