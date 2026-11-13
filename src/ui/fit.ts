import { $, q } from './dom';

const MAX_H = 950; // altura máxima do card dentro dos 1080px

/** Escala o card inteiro quando o conteúdo não cabe no stage. */
export const fitCard = (): void => {
  const tweet = q('.tweet');
  tweet.style.transform = 'none';
  const scale = Math.min(1, MAX_H / tweet.offsetHeight);
  tweet.style.transform = `scale(${scale})`;
};

/** Ajusta o stage de 1080x1080 à janela e o mantém centralizado. */
export const fitStage = (): void => {
  const holder = $('stage-holder');
  const wrap = q('.preview-wrap');
  const availW = wrap.clientWidth - 40;
  const availH = window.innerWidth > 800 ? wrap.clientHeight - 40 : Infinity;
  const scale = Math.min(1, availW / 1080, availH / 1080);
  holder.style.width = holder.style.height = `${1080 * scale}px`;
  $('stage').style.transform = `scale(${scale})`;
};
