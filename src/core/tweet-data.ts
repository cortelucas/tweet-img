import type { StatId } from './types';

/** Subconjunto da resposta do FxTwitter usado pelo app. Todos os campos são opcionais por segurança. */
export interface FxTweet {
  text?: string;
  created_at?: string;
  likes?: number;
  retweets?: number;
  replies?: number;
  views?: number;
  author?: { name?: string; screen_name?: string; avatar_url?: string };
  media?: {
    photos?: { url?: string }[];
    videos?: { thumbnail_url?: string }[];
  };
}

export interface ImportedTweet {
  name: string;
  handle: string;
  text: string;
  createdAt: Date | null;
  avatarUrl: string | null;
  photoUrl: string | null;
  stats: Record<StatId, string>;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const TWITTER_DATE =
  /^[A-Za-z]{3} ([A-Za-z]{3}) (\d{1,2}) (\d{2}):(\d{2}):(\d{2}) ([+-])(\d{2})(\d{2}) (\d{4})$/;

/** Converte "Wed Oct 26 18:45:58 +0000 2022" em Date (independe do fuso do navegador). */
export const parseTwitterDate = (value?: string): Date | null => {
  const m = TWITTER_DATE.exec(value ?? '');
  if (!m) return null;

  const month = MONTHS.indexOf(m[1]);
  if (month === -1) return null;

  const offsetMinutes = (m[6] === '-' ? -1 : 1) * (Number(m[7]) * 60 + Number(m[8]));
  const utc = Date.UTC(Number(m[9]), month, Number(m[2]), Number(m[3]), Number(m[4]), Number(m[5]));
  return new Date(utc - offsetMinutes * 60_000);
};

const compact = new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 });

/**
 * 1200 → "1,2 mil". Zero ou ausente vira vazio, como o X, que esconde contadores zerados.
 * O Intl separa número e unidade com espaço não separável (U+00A0/U+202F); normalizamos para um espaço comum.
 */
export const formatCount = (n?: number | null): string =>
  n && n > 0 ? compact.format(n).replace(/[\u00a0\u202f]/g, ' ') : '';

/** O X devolve o avatar em miniatura (_normal); pedimos a versão maior. */
const largerAvatar = (url?: string): string | null =>
  url ? url.replace('_normal.', '_400x400.') : null;

export const mapTweet = (tweet: FxTweet): ImportedTweet => ({
  name: tweet.author?.name ?? '',
  handle: tweet.author?.screen_name ?? '',
  text: tweet.text ?? '',
  createdAt: parseTwitterDate(tweet.created_at),
  avatarUrl: largerAvatar(tweet.author?.avatar_url),
  photoUrl: tweet.media?.photos?.[0]?.url ?? tweet.media?.videos?.[0]?.thumbnail_url ?? null,
  stats: {
    replies: formatCount(tweet.replies),
    reposts: formatCount(tweet.retweets),
    likes: formatCount(tweet.likes),
    views: formatCount(tweet.views),
  },
});
