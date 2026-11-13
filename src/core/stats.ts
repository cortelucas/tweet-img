import { STAT_IDS, type StatId } from "./types";

export interface StatItemView {
  visible: boolean;
  text: string;
}

export interface StatsView {
  visible: boolean;
  items: Record<StatId, StatItemView>;
}

/** Regra de exibição das interações: vazio some; "só ícones" mostra os 4 sem número. */
export const buildStatsView = (values: Record<StatId, string>, iconsOnly: boolean): StatsView => {
  const items = {} as Record<StatId, StatItemView>;
  let visible = false;

  for (const id of STAT_IDS) {
    const value = values[id].trim();
    const itemVisible = iconsOnly || value !== "";
    items[id] = { visible: itemVisible, text: iconsOnly ? "" : value };
    if (itemVisible) visible = true;
  }

  return { visible, items };
};
