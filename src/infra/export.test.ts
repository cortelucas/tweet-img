// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('html-to-image', () => ({
  toPng: vi.fn(),
}));

import { toPng } from 'html-to-image';
import { downloadPng } from './export';

describe('downloadPng', () => {
  beforeEach(() => {
    vi.mocked(toPng).mockResolvedValue('data:image/png;base64,encoded');
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  it('ignora imagens sem src e mantém imagens com src na exportação', async () => {
    const stage = document.createElement('div');
    const emptyImage = document.createElement('img');
    const loadedImage = document.createElement('img');
    loadedImage.src = 'data:image/png;base64,encoded';
    stage.append(emptyImage, loadedImage);

    await downloadPng(stage);

    const options = vi.mocked(toPng).mock.calls[0]?.[1];
    expect(options?.filter?.(emptyImage)).toBe(false);
    expect(options?.filter?.(loadedImage)).toBe(true);
  });
});
