import { buildStatsView } from '../core/stats';
import { type AppState, STAT_IDS, type StatId } from '../core/types';
import { $ } from './dom';
import { fitCard } from './fit';

export const bindStats = (state: AppState, persist: () => void): void => {
  const iconsOnly = $<HTMLInputElement>('iconsOnly');

  const render = (): void => {
    const values = {} as Record<StatId, string>;
    for (const id of STAT_IDS) values[id] = $<HTMLInputElement>(id).value;

    const view = buildStatsView(values, iconsOnly.checked);

    for (const id of STAT_IDS) {
      $<HTMLInputElement>(id).disabled = iconsOnly.checked;
      $(`p-${id}`).textContent = view.items[id].text;
      $(`s-${id}`).hidden = !view.items[id].visible;
    }
    $('p-stats').hidden = !view.visible;
    fitCard();
  };

  iconsOnly.checked = !!state.iconsOnly;
  iconsOnly.addEventListener('change', () => {
    state.iconsOnly = iconsOnly.checked;
    persist();
    render();
  });
  for (const id of STAT_IDS) $(id).addEventListener('input', render);
  render();
};
