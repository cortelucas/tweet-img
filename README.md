# tweet-img

Gerador de imagens **1080×1080** com a estética de um post do X.
Você informa texto e foto, e o app devolve um PNG pronto para postar.

**Demo:** https://cortelucas.github.io/tweet-img/

![Preview do app](docs/preview.png)

## Funcionalidades

- Card no estilo do X com nome, @usuário, avatar, texto, foto e data
- Saída sempre em **1080×1080 px**, independente do tamanho da tela
- Preview centralizado e ajustado automaticamente à janela
- Card que se reduz sozinho quando o texto é longo
- Foto do post em formato quadrado, 4:3 ou 16:9
- Data de hoje preenchida automaticamente (editável)
- Contadores de interação opcionais: respostas, reposts, curtidas e visualizações
- Três temas: claro, escuro (Dim) e escuro (Preto)
- Fonte Inter e emojis Twemoji (mesmo conjunto do X)
- Upload de imagens por clique, **arrastar e soltar** ou **colar** (`Ctrl+V`)
- Dados salvos no navegador (`localStorage`), com botão para limpar
- Marca d'água personalizável

## Como usar

1. Abra a [demo](https://cortelucas.github.io/tweet-img/) ou o `index.html` no navegador.
2. Preencha nome, @usuário, texto e, se quiser, avatar e foto.
3. Escolha o tema e o formato da foto.
4. Clique em **Baixar PNG 1080×1080**.

## Rodando localmente

Não há build nem dependências. Basta abrir o `index.html`:

```bash
git clone https://github.com/cortelucas/tweet-img.git
cd tweet-img
# abra index.html no navegador
```

## Estrutura

```
tweet-img/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── docs/
    └── preview.png
```

## Stack

- HTML, CSS e JavaScript puros
- [html-to-image](https://github.com/bubkoo/html-to-image) para exportar o PNG
- [Twemoji](https://github.com/jdecked/twemoji) para os emojis
- [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts)
- GitHub Pages para hospedagem

## Commits

O projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/).
