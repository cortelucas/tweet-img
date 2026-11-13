# tweet-img

Gerador de imagens **1080×1080** com a estética de um post do X.
Você informa texto e foto, e o app devolve um PNG pronto para postar.

**Demo:** https://cortelucas.github.io/tweet-img/

![Preview do app](docs/preview.png)

## Funcionalidades

- Card no estilo do X com nome, @usuário, avatar, texto, foto e data
- **Importação por link:** cole o link de um post público do X e o app preenche nome, texto, data, avatar, foto e contadores
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
2. Preencha nome, @usuário, texto e, se quiser, avatar e foto. Ou cole o link de um post em **Importar de um link do X** e clique em **Importar**.
3. Ajuste o que quiser: tema, formato da foto, data e contadores.
4. Clique em **Baixar PNG 1080×1080**.

### Importar de um link do X

Aceita links como `https://x.com/usuario/status/123` (também `twitter.com`, com `www.` ou `mobile.`, e com parâmetros como `?s=20`).
Depois de importar, todos os campos continuam editáveis.

Pontos de atenção:

- A importação usa a API pública do [FxTwitter](https://github.com/FixTweet/FxTwitter), um serviço de terceiros e não oficial. Ele pode ter limite de requisições, mudar ou ficar fora do ar. Nesse caso, preencha os campos manualmente.
- Só funciona com posts **públicos**. Posts privados ou apagados mostram uma mensagem de erro.
- Use com posts seus ou dê o crédito ao autor original.

## Desenvolvimento

Requer Node.js 20.19+ ou 22.12+.

```bash
git clone https://github.com/cortelucas/tweet-img.git
cd tweet-img
npm install
npm run dev
```

| Comando              | O que faz                            |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Servidor de desenvolvimento          |
| `npm test`           | Roda os testes (Vitest)              |
| `npm run test:watch` | Testes em modo watch                 |
| `npm run build`      | Checa os tipos e gera a pasta `dist` |
| `npm run preview`    | Serve o build localmente             |

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
│   │   ├── stats.ts
│   │   ├── tweet-url.ts           # extrai usuário e id do link
│   │   └── tweet-data.ts          # converte a resposta do FxTwitter nos campos do card
│   ├── infra/                     # localStorage, imagens, exportação PNG, API
│   │   ├── storage.ts
│   │   ├── image.ts
│   │   ├── export.ts
│   │   └── fxtwitter.ts           # cliente do FxTwitter
│   ├── ui/                        # manipulação do DOM
│   │   ├── dom.ts
│   │   ├── fit.ts
│   │   ├── form.ts
│   │   ├── import.ts              # campo "Importar de um link do X"
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
- [FxTwitter](https://github.com/FixTweet/FxTwitter) (API pública) para importar posts por link
- [Inter](https://fontsource.org/fonts/inter) via Fontsource

## Deploy

A cada push na `main`, o GitHub Actions roda os testes, gera o build e publica a pasta `dist` no GitHub Pages. Pull requests rodam só os testes e o build, sem publicar.

## Commits

O projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/pt-br/).
