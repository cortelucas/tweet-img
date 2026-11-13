// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { mountAppComponents } from './components';

describe('mountAppComponents', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
  });

  it('mounts the editor and preview as direct body children', () => {
    mountAppComponents();

    expect([...document.body.children].map((element) => element.tagName)).toEqual([
      'ASIDE',
      'MAIN',
    ]);
    expect(document.getElementById('import-url')).not.toBeNull();
    expect(document.getElementById('stage')).not.toBeNull();
  });
});
