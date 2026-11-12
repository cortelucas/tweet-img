const $ = (id) => document.getElementById(id);

const tweet = document.querySelector(".tweet");
const photo = $("p-photo");
const MAX_H = 950; // altura máxima do card dentro dos 1080px

/* ---------- Auto-ajuste: escala o card inteiro se não couber ---------- */
const fitCard = () => {
  tweet.style.transform = "none";
  const s = Math.min(1, MAX_H / tweet.offsetHeight);
  tweet.style.transform = `scale(${s})`;
};

/* ---------- Persistência (localStorage) ---------- */
const STORE_KEY = "tweet-img:v1";
const IMG_KEY = (id) => `${STORE_KEY}:img:${id}`;
const STATS = ["replies", "reposts", "likes", "views"];
const FIELDS = ["name", "handle", "text", "watermark", "theme", "ratio", ...STATS];

const state = (() => {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
})();

const save = () => {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn("Não foi possível salvar:", err);
  }
};

// restaura os campos ANTES do primeiro bind()
FIELDS.forEach((id) => {
  if (state[id] !== undefined) $(id).value = state[id];
});

FIELDS.forEach((id) => {
  const el = $(id);
  const evt = el.tagName === "SELECT" ? "change" : "input";
  el.addEventListener(evt, () => {
    state[id] = el.value;
    save();
  });
});

/* ---------- Texto ---------- */
const bind = (inputId, targetId) => {
  const input = $(inputId);
  const target = $(targetId);
  const update = () => {
    target.textContent = input.value;
    if (window.twemoji) twemoji.parse(target, { folder: "svg", ext: ".svg" });
    fitCard();
  };
  input.addEventListener("input", update);
  update();
};

/* ---------- Imagens ---------- */
// reduz a imagem (máx. 1600px) para caber no localStorage
const shrink = (dataUrl, max = 1600) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * k);
      c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL("image/webp", 0.9));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

const applyImage = (inputId, targetId, dataUrl, name) => {
  const label = $(inputId).closest(".upload");
  const thumb = label.querySelector(".thumb");
  $(targetId).src = dataUrl;
  thumb.src = dataUrl;
  thumb.hidden = false;
  label.querySelector(".upload-text").textContent = name;
  label.classList.add("has-file");
};

const bindImage = (inputId, targetId) => {
  const label = $(inputId).closest(".upload");

  // restaura a imagem salva
  try {
    const saved = JSON.parse(localStorage.getItem(IMG_KEY(inputId)));
    if (saved) applyImage(inputId, targetId, saved.data, saved.name);
  } catch {}

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = async () => {
      applyImage(inputId, targetId, reader.result, file.name);
      const small = await shrink(reader.result);
      try {
        localStorage.removeItem(IMG_KEY(inputId));
        localStorage.setItem(IMG_KEY(inputId), JSON.stringify({ data: small, name: file.name }));
      } catch {
        console.warn("Imagem grande demais para salvar; não será restaurada.");
      }
    };
    reader.readAsDataURL(file);
  };

  // clicar
  $(inputId).addEventListener("change", (e) => handleFile(e.target.files[0]));

  // arrastar e soltar
  ["dragenter", "dragover"].forEach((ev) =>
    label.addEventListener(ev, (e) => {
      e.preventDefault();
      label.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach((ev) =>
    label.addEventListener(ev, (e) => {
      e.preventDefault();
      label.classList.remove("dragover");
    })
  );
  label.addEventListener("drop", (e) => handleFile(e.dataTransfer.files[0]));

  return handleFile;
};

/* ---------- Data de hoje (editável, não é salva) ---------- */
$("datetime").value = new Date()
  .toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })
  .replace(".", ""); // ex.: 11 de nov de 2026

bind("name", "p-name");
bind("handle", "p-handle");
bind("text", "p-text");
bind("datetime", "p-datetime");
bind("watermark", "p-watermark");

bindImage("avatar", "p-avatar");
const handlePhoto = bindImage("photo", "p-photo");

// colar imagem (Ctrl+V) vai para a foto do post
document.addEventListener("paste", (e) => {
  const item = [...(e.clipboardData?.items || [])].find((i) => i.type.startsWith("image/"));
  if (!item) return;
  e.preventDefault();
  handlePhoto(item.getAsFile());
});

// evita que o navegador abra a imagem se soltar fora da área
["dragover", "drop"].forEach((ev) => window.addEventListener(ev, (e) => e.preventDefault()));

/* ---------- Interações (some se estiver vazio) ---------- */
const updateStats = () => {
  let any = false;
  STATS.forEach((id) => {
    const v = $(id).value.trim();
    $(`p-${id}`).textContent = v;
    $(`s-${id}`).hidden = !v;
    if (v) any = true;
  });
  $("p-stats").hidden = !any;
  fitCard();
};
STATS.forEach((id) => $(id).addEventListener("input", updateStats));
updateStats();

/* ---------- Tema ---------- */
$("theme").addEventListener("change", (e) => {
  $("stage").dataset.theme = e.target.value;
});
$("stage").dataset.theme = $("theme").value;

/* ---------- Formato da foto ---------- */
$("ratio").addEventListener("change", (e) => {
  photo.style.aspectRatio = e.target.value;
  fitCard();
});
photo.style.aspectRatio = $("ratio").value;

photo.addEventListener("load", fitCard);
$("p-avatar").addEventListener("load", fitCard);
document.fonts.ready.then(fitCard);
fitCard();

/* ---------- Preview: ajusta o stage à tela e centraliza ---------- */
const holder = $("stage-holder");
const wrap = document.querySelector(".preview-wrap");

const fitStage = () => {
  const availW = wrap.clientWidth - 40;
  const availH = window.innerWidth > 800 ? wrap.clientHeight - 40 : Infinity;
  const s = Math.min(1, availW / 1080, availH / 1080);
  holder.style.width = holder.style.height = `${1080 * s}px`;
  $("stage").style.transform = `scale(${s})`;
};
window.addEventListener("resize", fitStage);
fitStage();

/* ---------- Download ---------- */
$("download").addEventListener("click", async () => {
  try {
    const dataUrl = await htmlToImage.toPng($("stage"), {
      width: 1080,
      height: 1080,
      pixelRatio: 1,
      cacheBust: true,
      style: { transform: "none" }, // exporta sempre em 1080x1080 reais
    });
    const a = document.createElement("a");
    a.download = "tweet-1080.png";
    a.href = dataUrl;
    a.click();
  } catch (err) {
    console.error("Erro ao exportar:", err);
    alert("Falha ao gerar a imagem. Veja o console.");
  }
});

/* ---------- Limpar dados salvos ---------- */
$("reset").addEventListener("click", () => {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(STORE_KEY))
    .forEach((k) => localStorage.removeItem(k));
  location.reload();
});
