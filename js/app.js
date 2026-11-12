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
const bindImage = (inputId, targetId) => {
  const input = $(inputId);
  const label = input.closest(".upload");
  const thumb = label.querySelector(".thumb");
  const text = label.querySelector(".upload-text");

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      $(targetId).src = reader.result;
      thumb.src = reader.result;
      thumb.hidden = false;
      text.textContent = file.name;
      label.classList.add("has-file");
    };
    reader.readAsDataURL(file);
  });
};

bind("name", "p-name");
bind("handle", "p-handle");
bind("text", "p-text");
bind("datetime", "p-datetime");
bind("watermark", "p-watermark");

bindImage("avatar", "p-avatar");
bindImage("photo", "p-photo");

/* ---------- Formato da foto ---------- */
$("ratio").addEventListener("change", (e) => {
  photo.style.aspectRatio = e.target.value;
  fitCard();
});

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