export type FormControl = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export const $ = <T extends HTMLElement = HTMLElement>(id: string): T => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemento #${id} não encontrado`);
  return el as T;
};

export const q = <T extends HTMLElement = HTMLElement>(selector: string): T => {
  const el = document.querySelector<T>(selector);
  if (!el) throw new Error(`Elemento "${selector}" não encontrado`);
  return el;
};
