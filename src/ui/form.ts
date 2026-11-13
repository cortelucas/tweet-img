import twemoji from '@twemoji/api';
import { $ } from './dom';
import { fitCard } from './fit';

export const renderEmoji = (el: HTMLElement): void => {
  twemoji.parse(el, { folder: 'svg', ext: '.svg' });
};

export const bindText = (inputId: string, targetId: string): void => {
  const input = $<HTMLInputElement | HTMLTextAreaElement>(inputId);
  const target = $(targetId);

  const update = (): void => {
    target.textContent = input.value;
    renderEmoji(target);
    fitCard();
  };

  input.addEventListener('input', update);
  update();
};
