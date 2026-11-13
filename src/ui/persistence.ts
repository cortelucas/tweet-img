import { type AppState, FIELD_IDS } from '../core/types';
import { saveState } from '../infra/storage';
import { $, type FormControl } from './dom';

/** Restaura os campos salvos ANTES do primeiro bindText(). */
export const restoreFields = (state: AppState): void => {
  for (const id of FIELD_IDS) {
    const value = state[id];
    if (value !== undefined) $<FormControl>(id).value = value;
  }
};

export const persistFields = (state: AppState): void => {
  for (const id of FIELD_IDS) {
    const el = $<FormControl>(id);
    const event = el instanceof HTMLSelectElement ? 'change' : 'input';
    el.addEventListener(event, () => {
      state[id] = el.value;
      saveState(state);
    });
  }
};
