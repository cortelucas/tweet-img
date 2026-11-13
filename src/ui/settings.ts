import { $ } from "./dom";
import { fitCard } from "./fit";

/** Tema do card e formato (aspect ratio) da foto do post. */
export const bindSettings = (): void => {
  const theme = $<HTMLSelectElement>("theme");
  const ratio = $<HTMLSelectElement>("ratio");
  const stage = $("stage");
  const photo = $("p-photo");

  const applyTheme = (): void => {
    stage.dataset.theme = theme.value;
  };
  const applyRatio = (): void => {
    photo.style.aspectRatio = ratio.value;
    fitCard();
  };

  theme.addEventListener("change", applyTheme);
  ratio.addEventListener("change", applyRatio);
  applyTheme();
  applyRatio();
};
