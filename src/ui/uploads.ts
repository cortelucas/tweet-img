import type { ImageId } from "../core/types";
import { readAsDataUrl, shrink } from "../infra/image";
import { loadImage, saveImage } from "../infra/storage";
import { $ } from "./dom";

export type FileHandler = (file: File | null | undefined) => Promise<void>;

export const bindImage = (inputId: ImageId, targetId: string): FileHandler => {
  const input = $<HTMLInputElement>(inputId);
  const label = input.closest<HTMLElement>(".upload");
  const thumb = label?.querySelector<HTMLImageElement>(".thumb");
  const text = label?.querySelector<HTMLElement>(".upload-text");
  if (!label || !thumb || !text) throw new Error(`#${inputId} precisa estar dentro de .upload`);

  const apply = (data: string, name: string): void => {
    $<HTMLImageElement>(targetId).src = data;
    thumb.src = data;
    thumb.hidden = false;
    text.textContent = name;
    label.classList.add("has-file");
  };

  const saved = loadImage(inputId);
  if (saved) apply(saved.data, saved.name);

  const handleFile: FileHandler = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const data = await readAsDataUrl(file);
    apply(data, file.name);
    const small = await shrink(data);
    if (!saveImage(inputId, { data: small, name: file.name })) {
      console.warn("Imagem grande demais para salvar; não será restaurada.");
    }
  };

  // clicar
  input.addEventListener("change", () => void handleFile(input.files?.[0]));

  // arrastar e soltar
  for (const event of ["dragenter", "dragover"]) {
    label.addEventListener(event, (e) => {
      e.preventDefault();
      label.classList.add("dragover");
    });
  }
  for (const event of ["dragleave", "drop"]) {
    label.addEventListener(event, (e) => {
      e.preventDefault();
      label.classList.remove("dragover");
    });
  }
  label.addEventListener("drop", (e) => void handleFile((e as DragEvent).dataTransfer?.files[0]));

  return handleFile;
};

/** Ctrl+V com imagem na área de transferência. */
export const bindPaste = (handle: FileHandler): void => {
  document.addEventListener("paste", (e) => {
    const item = Array.from(e.clipboardData?.items ?? []).find((i) => i.type.startsWith("image/"));
    if (!item) return;
    e.preventDefault();
    void handle(item.getAsFile());
  });
};

/** Evita que o navegador abra a imagem se soltar fora da área. */
export const blockStrayDrops = (): void => {
  for (const event of ["dragover", "drop"]) {
    window.addEventListener(event, (e) => e.preventDefault());
  }
};
