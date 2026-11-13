import { describe, expect, it } from 'vitest';
import { type FxTweet, formatCount, mapTweet, parseTwitterDate } from './tweet-data';

describe('parseTwitterDate', () => {
  it('converte o formato do X para uma data UTC correta', () => {
    expect(parseTwitterDate('Wed Oct 26 18:45:58 +0000 2022')?.toISOString()).toBe(
      '2022-10-26T18:45:58.000Z',
    );
  });

  it('respeita o deslocamento de fuso', () => {
    expect(parseTwitterDate('Wed Oct 26 18:45:58 -0300 2022')?.toISOString()).toBe(
      '2022-10-26T21:45:58.000Z',
    );
  });

  it('aceita dia com um dígito', () => {
    expect(parseTwitterDate('Thu Jan 5 01:02:03 +0000 2023')?.toISOString()).toBe(
      '2023-01-05T01:02:03.000Z',
    );
  });

  it.each([['texto qualquer'], [''], ['Wed Xyz 26 18:45:58 +0000 2022']])(
    'devolve null para %j',
    (value) => {
      expect(parseTwitterDate(value)).toBeNull();
    },
  );

  it('devolve null quando não há valor', () => {
    expect(parseTwitterDate(undefined)).toBeNull();
  });
});

describe('formatCount', () => {
  it.each([
    [345, '345'],
    [1200, '1,2 mil'],
    [12_345, '12,3 mil'],
    [1_500_000, '1,5 mi'],
  ])('formata %i como %s', (n, expected) => {
    expect(formatCount(n)).toBe(expected);
  });

  it.each([[0], [undefined], [null], [-5]])('devolve vazio para %j', (n) => {
    expect(formatCount(n)).toBe('');
  });
});

describe('mapTweet', () => {
  const full: FxTweet = {
    text: 'Hoje celebramos São Martinho',
    created_at: 'Wed Oct 26 18:45:58 +0000 2022',
    likes: 1200,
    retweets: 45,
    replies: 0,
    views: 2_300_000,
    author: {
      name: 'Lucas S. Corte',
      screen_name: 'olucascorte',
      avatar_url: 'https://pbs.twimg.com/profile_images/1/abc_normal.jpg',
    },
    media: { photos: [{ url: 'https://pbs.twimg.com/media/foto.jpg' }] },
  };

  it('mapeia todos os campos do post', () => {
    expect(mapTweet(full)).toEqual({
      name: 'Lucas S. Corte',
      handle: 'olucascorte',
      text: 'Hoje celebramos São Martinho',
      createdAt: new Date('2022-10-26T18:45:58.000Z'),
      avatarUrl: 'https://pbs.twimg.com/profile_images/1/abc_400x400.jpg',
      photoUrl: 'https://pbs.twimg.com/media/foto.jpg',
      stats: { replies: '', reposts: '45', likes: '1,2 mil', views: '2,3 mi' },
    });
  });

  it('usa a miniatura do vídeo quando não há foto', () => {
    const tweet: FxTweet = {
      media: { videos: [{ thumbnail_url: 'https://pbs.twimg.com/thumb.jpg' }] },
    };
    expect(mapTweet(tweet).photoUrl).toBe('https://pbs.twimg.com/thumb.jpg');
  });

  it('prefere a foto à miniatura do vídeo', () => {
    const tweet: FxTweet = {
      media: { photos: [{ url: 'foto' }], videos: [{ thumbnail_url: 'thumb' }] },
    };
    expect(mapTweet(tweet).photoUrl).toBe('foto');
  });

  it('tolera um post praticamente vazio', () => {
    expect(mapTweet({})).toEqual({
      name: '',
      handle: '',
      text: '',
      createdAt: null,
      avatarUrl: null,
      photoUrl: null,
      stats: { replies: '', reposts: '', likes: '', views: '' },
    });
  });
});
