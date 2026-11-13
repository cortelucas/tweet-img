import { describe, expect, it } from 'vitest';
import { buildStatsView } from './stats';
import type { StatId } from './types';

const values = (overrides: Partial<Record<StatId, string>> = {}): Record<StatId, string> => ({
  replies: '',
  reposts: '',
  likes: '',
  views: '',
  ...overrides,
});

describe('buildStatsView', () => {
  it('esconde a linha inteira quando todos os campos estão vazios', () => {
    const view = buildStatsView(values(), false);
    expect(view.visible).toBe(false);
    expect(Object.values(view.items).every((item) => !item.visible)).toBe(true);
  });

  it('mostra só os campos preenchidos', () => {
    const view = buildStatsView(values({ likes: '1,2 mil', views: '345' }), false);
    expect(view.visible).toBe(true);
    expect(view.items.likes).toEqual({ visible: true, text: '1,2 mil' });
    expect(view.items.views).toEqual({ visible: true, text: '345' });
    expect(view.items.replies.visible).toBe(false);
    expect(view.items.reposts.visible).toBe(false);
  });

  it('ignora espaços e trata campo só com espaços como vazio', () => {
    const view = buildStatsView(values({ likes: '  12  ', replies: '   ' }), false);
    expect(view.items.likes.text).toBe('12');
    expect(view.items.replies.visible).toBe(false);
  });

  it('no modo só ícones mostra os quatro sem números', () => {
    const view = buildStatsView(values(), true);
    expect(view.visible).toBe(true);
    for (const item of Object.values(view.items)) {
      expect(item).toEqual({ visible: true, text: '' });
    }
  });

  it('no modo só ícones ignora os valores digitados', () => {
    const view = buildStatsView(values({ likes: '99' }), true);
    expect(view.items.likes.text).toBe('');
  });
});
