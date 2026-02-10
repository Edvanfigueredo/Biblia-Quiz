<p align="center">
  <img src="/Biblia-Quiz/assets/biblia.jpeg" alt="Biblia & Quiz" width="50%" />
</p>
# 📖 Bíblia Quiz — Sistema Inteligente de Perguntas Bíblicas

Motor de quiz dinâmico baseado em **texto estruturado**.  
Embora o projeto demonstre uso com conteúdo bíblico, ele **não é apenas um quiz da Bíblia** — é uma engine reutilizável de geração automática de perguntas a partir de qualquer livro estruturado.


## 🎯 Conceito

O sistema interpreta um arquivo de texto padronizado e gera automaticamente:

- perguntas
- alternativas
- questões aleatórias
- controle de repetição
- feedback de resposta
- fluxo de tentativas

Na prática, é um:

> 📚 **Motor de quiz baseado em texto estruturado**


## 📄 Formato de Entrada

Funciona com qualquer conteúdo que siga o padrão:

Tópico Capítulo:Versículo Texto


Exemplo:

Gênesis 1:1 No princípio criou Deus os céus e a terra
História 2:4 Dom Pedro proclamou a independência
Lei 5:12 Artigo constitucional



## 🚀 Funcionalidades

- Geração automática de perguntas
- Alternativas randômicas
- Não repete questões na sessão
- Duas tentativas por pergunta
- Feedback visual de acerto/erro
- Layout responsivo (mobile)
- Execução 100% client-side
- Compatível com GitHub Pages


## 🛠 Stack

- HTML5
- CSS3
- JavaScript (Vanilla)
- Parsing de texto
- Randomização controlada


## 🐍 Pré-processamento com Python

O arquivo de texto utilizado pelo quiz foi gerado a partir de conteúdo bruto e **padronizado com Python** para garantir compatibilidade com o motor de perguntas.

O script identifica:

- nome do livro
- capítulo
- versículo
- texto
- estrutura das linhas

Convertendo para o formato:

Livro Capítulo:Versículo Texto


### Script de formatação usado

```python
import re

IN = "entrada.txt"
OUT = "bible.txt"

livro = ""
cap = ""
saida = []

for l in open(IN, encoding="utf8", errors="ignore"):
    l = l.strip()

    if not l:
        continue

    L = l.upper()

    # livro + capítulo (ex: GÊNESIS 1)
    m = re.match(r"([A-ZÇÊÉÍÓÚÃÕ\s]+)\s+(\d+)$", L)
    if m and len(L) < 40:
        livro = m.group(1).title()
        cap = m.group(2)
        continue

    # livro isolado
    if L.isupper() and len(L) < 25 and not L[-1].isdigit():
        livro = l.title()
        continue

    # versículo
    mv = re.match(r"(\d+)\s+(.*)", l)

    if mv and livro and cap:
        v = mv.group(1)
        txt = mv.group(2)
        saida.append(f"{livro} {cap}:{v} {txt}")

open(OUT,"w",encoding="utf8").write("\n".join(saida))

print("Arquivo formatado com sucesso")
```

🔄 Reuso
Pode ser adaptado para:

-livros didáticos
-textos jurídicos
-materiais históricos
-conteúdos educacionais
-textos religiosos diversos

Basta manter o formato estruturado.

👨‍💻 Autor
Edvan Figuerêdo
