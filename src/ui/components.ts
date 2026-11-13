import editorPanel from '../components/editor-panel.html?raw';
import tweetPreview from '../components/tweet-preview.html?raw';
import { $ } from './dom';

export const mountAppComponents = (): void => {
  const template = document.createElement('template');
  template.innerHTML = `${editorPanel}${tweetPreview}`;
  $('app').replaceWith(template.content);
};
