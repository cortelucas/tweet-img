# tweet-img

Gerador de imagens **1080×1080** com a estética de um post do X.
Você informa texto e foto, e o app devolve um PNG pronto para postar.

**Demo:** https://cortelucas.github.io/tweet-img/

![Preview do app](docs/preview.png)

## Funcionalidades

- Card no estilo do X com nome, @usuário, avatar, texto, foto e data
- Saída sempre em **1080×1080 px**, independente do tamanho da tela
- Preview centralizado e ajustado automaticamente à janela
- Card que se reduz sozinho quando o texto é longo; palavras muito longas são quebradas
- Foto do post em formato quadrado, 4:3 ou 16:9
- Data de hoje preenchida automaticamente (editável)
- Contadores de interação opcionais (respostas, reposts, curtidas e visualizações), com modo só ícones
- Três temas: claro, escuro (Dim) e escuro (Preto)
- Fonte Inter e emojis Twemoji (mesmo conjunto do X)
- Upload de imagens por clique, **arrastar e soltar** ou **colar** (`Ctrl+V`)
- Dados salvos no navegador (`localStorage`), com botão para limpar
- Marca d'água personalizável

## Como usar

1. Abra a [demo](https://cortelucas.github.io/tweet-img/).
2. Preencha nome, @usuário, texto e, se quiser, avatar e foto.
3. Escolha o tema e o formato da foto.
4. Clique em **Baixar PNG 1080×1080**.

## Desenvolvimento

Requer Node.js 20.19+ ou 22.12+.

```bash
git clone https://github.com/cortelucas/tweet-img.git
cd tweet-img
npm install
npm run dev
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm test` | Roda os testes (Vitest) |
| `npm run test:watch` | Testes em modo watch |
| `npm run build` | Checa os tipos e gera a pasta `dist` |
| `npm run preview` | Serve o build localmente |

## Estrutura

```
tweet-img/
├── .github/workflows/deploy.yml   # CI e deploy
├── docs/preview.png
├── public/favicon.svg
├── src/
│   ├── main.ts                    # orquestra os módulos
│   ├── core/                      # regras puras, sem DOM (testadas)
│   │   ├── types.ts
│   │   ├── date.ts
│   │   └── stats.ts
│   ├── infra/                     # localStorage, imagens, exportação PNG
│   │   ├── storage.ts
│   │   ├── image.ts
│   │   └── export.ts
│   ├── ui/                        # manipulação do DOM
│   │   ├── dom.ts
│   │   ├── fit.ts
│   │   ├── form.ts
│   │   ├── persistence.ts
│   │   ├── settings.ts
│   │   ├── stats.ts
│   │   └── uploads.ts
│   └── styles/style.css
├── index.html
├── vite.config.ts
└── package.json
```

## Stack

- [Vite](https://vite.dev/) + TypeScript (modo estrito)
- [Vitest](https://vitest.dev/) + jsdom para os testes
- [html-to-image](https://github.com/bubkoo/html-to-image) para exportar o PNG
- [Twemoji](https://github.com/jdecked/twemoji) para os emojis
- [Inter](https://fontsource.org/fonts/inter) via Fontsource

## Deploy

A cada push na `main`, o GitHub Actions roda os testes, gera o build e publica a pasta `dist` no GitHub Pages. Pull requests rodam só os testes e o build, sem publicar.

## Commits

O projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/).
