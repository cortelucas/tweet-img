import type { FxTweet } from '../core/tweet-data';
import type { TweetRef } from '../core/tweet-url';

export type TweetFetchReason = 'network' | 'not-found' | 'rate-limit' | 'unknown';

export class TweetFetchError extends Error {
  reason: TweetFetchReason;

  constructor(reason: TweetFetchReason, message: string) {
    super(message);
    this.name = 'TweetFetchError';
    this.reason = reason;
  }
}

interface FxResponse {
  code?: number;
  tweet?: FxTweet | null;
}

const API = 'https://api.fxtwitter.com';

/** Busca um post público pela API do FxTwitter (sem chave). */
export const fetchTweet = async (
  { username, id }: TweetRef,
  fetchFn: typeof fetch = fetch,
): Promise<FxTweet> => {
  let res: Response;
  try {
    res = await fetchFn(`${API}/${username}/status/${id}`);
  } catch {
    throw new TweetFetchError(
      'network',
      'Não foi possível acessar o serviço. Verifique a conexão.',
    );
  }

  if (res.status === 429) {
    throw new TweetFetchError('rate-limit', 'Muitas requisições. Tente de novo em instantes.');
  }

  let body: FxResponse;
  try {
    body = (await res.json()) as FxResponse;
  } catch {
    throw new TweetFetchError('unknown', 'Resposta inesperada do serviço.');
  }

  // o FxTwitter pode responder 404 no corpo mesmo com HTTP 200
  if (res.status === 404 || body.code === 404 || !body.tweet) {
    throw new TweetFetchError(
      'not-found',
      'Post não encontrado. Ele pode ser privado ou ter sido apagado.',
    );
  }
  if (!res.ok) {
    throw new TweetFetchError('unknown', `O serviço respondeu com erro (${res.status}).`);
  }

  return body.tweet;
};
