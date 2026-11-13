import type { AppState, ImageId, StoredImage } from '../core/types';

const KEY = 'tweet-img:v1';
const imageKey = (id: ImageId): string => `${KEY}:img:${id}`;

export const loadState = (): AppState => {
  try {
    return (JSON.parse(localStorage.getItem(KEY) ?? '{}') as AppState | null) ?? {};
  } catch {
    return {};
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Não foi possível salvar:', err);
  }
};

export const loadImage = (id: ImageId): StoredImage | null => {
  try {
    const raw = localStorage.getItem(imageKey(id));
    return raw ? (JSON.parse(raw) as StoredImage) : null;
  } catch {
    return null;
  }
};

export const saveImage = (id: ImageId, image: StoredImage): boolean => {
  try {
    localStorage.removeItem(imageKey(id));
    localStorage.setItem(imageKey(id), JSON.stringify(image));
    return true;
  } catch {
    return false;
  }
};

export const removeImage = (id: ImageId): void => {
  try {
    localStorage.removeItem(imageKey(id));
  } catch {
    // sem acesso ao storage: nada a remover
  }
};

export const clearAll = (): void => {
  for (const key of Object.keys(localStorage)) {
    if (key.startsWith(KEY)) localStorage.removeItem(key);
  }
};
