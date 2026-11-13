import type { ImageId } from "../core/types";
import { readAsDataUrl, shrink } from "../infra/image";
import { loadImage, removeImage, saveImage } from "../infra/storage";
import { $ } from "./dom";
import { fitCard } from "./fit";

export type FileHandler = (file: File | null | undefined) => Promise<void>;

export interface ImageControl {
  load: FileHandler;
  clear: () => void;
}

export const bindImage = (inputId: ImageId, targetId: string): ImageControl => {
  const input = $<HTMLInputElement>(inputId);
  const label = input.closest<HTMLElement>(".upload");
  const thumb = label?.querySelector<HTMLImageElement>(".thumb");
  const text = label?.querySelector<HTMLElement>(".upload-text");
  if (!label || !thumb || !text) throw new Error(`#${inputId} precisa estar dentro de .upload`);

  const defaultText = text.textContent ?? "";

  const apply = (data: string, name: string): void => {
    $<HTMLImageElement>(targetId).src = data;
    thumb.src = data;
    thumb.hidden = false;
    text.textContent = name;
    label.classList.add("has-file");
  };

  const clear = (): void => {
    $<HTMLImageElement>(targetId).removeAttribute("src");
    thumb.removeAttribute("src");
    thumb.hidden = true;
    text.textContent = defaultText;
    label.classList.remove("has-file");
    input.value = "";
    removeImage(inputId);
    fitCard();
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

  return { load: handleFile, clear };
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
