import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";
import "./styles/style.css";

import { formatDate } from "./core/date";
import { clearAll, loadState, saveState } from "./infra/storage";
import { downloadPng } from "./infra/export";
import { $ } from "./ui/dom";
import { fitCard, fitStage } from "./ui/fit";
import { bindText } from "./ui/form";
import { bindImport } from "./ui/import";
import { persistFields, restoreFields } from "./ui/persistence";
import { bindSettings } from "./ui/settings";
import { bindStats } from "./ui/stats";
import { bindImage, bindPaste, blockStrayDrops } from "./ui/uploads";

const state = loadState();

// campos: restaura antes do primeiro bind
restoreFields(state);
persistFields(state);

// data de hoje (editável, não é salva)
$<HTMLInputElement>("datetime").value = formatDate();

bindText("name", "p-name");
bindText("handle", "p-handle");
bindText("text", "p-text");
bindText("datetime", "p-datetime");
bindText("watermark", "p-watermark");

const avatar = bindImage("avatar", "p-avatar");
const photo = bindImage("photo", "p-photo");
bindPaste(photo.load);
blockStrayDrops();
bindImport({ avatar, photo });

bindSettings();
bindStats(state, () => saveState(state));

// re-ajusta quando imagens/fontes terminam de carregar
$("p-photo").addEventListener("load", fitCard);
$("p-avatar").addEventListener("load", fitCard);
void document.fonts.ready.then(fitCard);
fitCard();

fitStage();
window.addEventListener("resize", fitStage);

$("download").addEventListener("click", async () => {
  try {
    await downloadPng($("stage"));
  } catch (err) {
    console.error("Erro ao exportar:", err);
    alert("Falha ao gerar a imagem. Veja o console.");
  }
});

$("reset").addEventListener("click", () => {
  clearAll();
  location.reload();
});
