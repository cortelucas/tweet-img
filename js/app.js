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
    fitCard();
  };
  input.addEventListener("input", update);
  update();
};

/* ---------- Imagens ---------- */
const bindImage = (inputId, targetId) => {
  $(inputId).addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => ($(targetId).src = reader.result);
    reader.readAsDataURL(file);
  });
};

/* ---------- Data de hoje (editável) ---------- */
$("datetime").value = new Date()
  .toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })
  .replace(".", ""); // ex.: 11 de nov de 2026

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

/* ---------- Download ---------- */
$("download").addEventListener("click", async () => {
  try {
    const dataUrl = await htmlToImage.toPng($("stage"), {
      width: 1080,
      height: 1080,
      pixelRatio: 1,
      cacheBust: true,
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
