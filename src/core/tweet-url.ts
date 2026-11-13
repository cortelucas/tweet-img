export interface TweetRef {
  username: string;
  id: string;
}

const HOSTS = new Set([
  'x.com',
  'twitter.com',
  'fxtwitter.com',
  'fixupx.com',
  'vxtwitter.com',
  'fixvx.com',
]);
const USERNAME = /^\w{1,15}$/;
const STATUS_ID = /^\d{1,25}$/;

/** Extrai usuário e id de um link de post do X. Devolve null se não for um link válido. */
export const parseTweetUrl = (input: string): TweetRef | null => {
  const raw = input.trim();
  if (!raw) return null;

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  const host = url.hostname.toLowerCase().replace(/^(www|mobile)\./, '');
  if (!HOSTS.has(host)) return null;

  const parts = url.pathname.split('/').filter(Boolean);
  // /i/web/status/ID  →  /i/status/ID
  const segments = parts[0] === 'i' && parts[1] === 'web' ? ['i', ...parts.slice(2)] : parts;
  const [username, kind, id] = segments;

  if (!username || !USERNAME.test(username)) return null;
  if (kind !== 'status' && kind !== 'statuses') return null;
  if (!id || !STATUS_ID.test(id)) return null;

  return { username, id };
};
