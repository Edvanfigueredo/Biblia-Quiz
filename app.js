let versos = [];
let perguntasGeradas = [];
let usadas = new Set();
let atual = null;
let religiaoSelecionada = null;

/* ===================== */

async function carregarBiblia() {
    const r = await fetch("bible.txt");
    const t = await r.text();

    versos = t.split("\n")
    .filter(l => /\d+:\d+/.test(l));
}

/* ===================== */

function parseVerso(v) {
    const m = v.match(/^(.+?)\s(\d+:\d+)\s(.+)/);
    if (!m) return null;

    return {
        ivro: m[1],
        ref: m[2],
        texto: m[3]
    };
}

/* ===================== */

function gerarPerguntasPorReligiao(religiao) {
    perguntasGeradas = [];

  // Palavras-chave por religião
    const temas = {
        "Católica": ["Deus", "Jesus", "Maria", "fé", "amor", "igreja"],
        "Protestante": ["Deus", "Jesus", "fé", "graça", "salvação", "evangelho"],
        "Ateu": ["vida", "morte", "homem", "mulher", "sabedoria"],
        "Umbanda": ["espírito", "luz", "fé", "amor", "cura"],
        "Candomblé": ["força", "fé", "vida", "justiça", "amor"],
        "Budismo": ["espírito", "alma", "vida", "paz", "sabedoria"],
        "Espiritismo": ["espírito", "alma", "vida eterna", "fé", "amor"]
    };

    const palavras = temas[religiao] || ["Deus", "Jesus", "fé", "amor"];

    versos.forEach(v => {
        const p = parseVerso(v);
            if (!p) return;

    for (let palavra of palavras) {
        if (p.texto.toLowerCase().includes(palavra.toLowerCase())) {
            perguntasGeradas.push({
            pergunta: `O que este versículo fala sobre ${palavra}?`,
            resposta: palavra,
            ref: `${p.livro} ${p.ref}`,
            verso: p.texto
        });
            break;
            }
        }
    });

  // Limitar a 100 perguntas
    perguntasGeradas = perguntasGeradas.slice(0, 100);

    console.log(`Perguntas geradas para ${religiao}:`, perguntasGeradas.length);
}

/* ===================== */

function alternativas(correta) {
    const nomes = [...new Set(perguntasGeradas.map(p => p.resposta))];
    const s = new Set([correta]);

    while (s.size < 4) {
        s.add(nomes[Math.random() * nomes.length | 0]);
    }

    return [...s].sort(() => Math.random() - 0.5);
}

/* ===================== */

async function iniciarQuiz() {
    const nomeInput = document.getElementById("nome");
    const religiaoSelect = document.getElementById("religiao");

    if (!nomeInput || !religiaoSelect) {
        alert("Erro DOM");
        return;
    }

    const nome = nomeInput.value || "Visitante";
    religiaoSelecionada = religiaoSelect.value;

    document.getElementById("ola").innerText = `Olá ${nome}! Você escolheu ${religiaoSelecionada}.`;

    await carregarBiblia();
    gerarPerguntasPorReligiao(religiaoSelecionada);

    usadas.clear();
    novaPergunta();
}

/* ===================== */

function novaPergunta() {
    const btnProxima = document.getElementById("btnProxima");
    const feedback = document.getElementById("feedback");
    const q = document.getElementById("q");
    const altsDiv = document.getElementById("altsDiv");

    btnProxima.style.display = "none";
    feedback.innerHTML = "";

    if (usadas.size >= perguntasGeradas.length) {
        usadas.clear();
    }

    let p;
        do {
         p = perguntasGeradas[Math.random() * perguntasGeradas.length | 0];
        } while (usadas.has(p));

    usadas.add(p);

    const alts = alternativas(p.resposta);

    atual = {
        ...p,
        alts,
        c: alts.indexOf(p.resposta)
    };

    q.innerText = p.pergunta;
    altsDiv.innerHTML = "";

    alts.forEach((t, i) => {
        const d = document.createElement("div");
        d.className = "alt";
        d.innerText = t;
        d.onclick = () => responder(i, d);
        altsDiv.appendChild(d);
    });
}

/* ===================== */

function responder(i, el) {
    const btnProxima = document.getElementById("btnProxima");
    const feedback = document.getElementById("feedback");

    document.querySelectorAll(".alt")
        .forEach(x => x.onclick = null);

    document.querySelectorAll(".alt")[atual.c]
        .classList.add("correta");

    if (i === atual.c) {
        el.classList.add("correta");
        feedback.innerHTML =
        `   ✅ Correto!<br><b>${atual.resposta}</b><br>📖 ${atual.ref}<br><small>${atual.verso}</small>`;
    } else {
    el.classList.add("errada");
    feedback.innerHTML =
        `❌ Errado.<br>A resposta correta é: <b>${atual.resposta}</b><br>📖 ${atual.ref}<br><small>${atual.verso}</small>`;
    }

    btnProxima.style.display = "block";
}
