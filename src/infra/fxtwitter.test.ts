import { describe, expect, it, vi } from "vitest";
import { TweetFetchError, fetchTweet } from "./fxtwitter";

const ref = { username: "olucascorte", id: "123" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });

const expectReason = async (promise: Promise<unknown>, reason: string) => {
  const error = await promise.catch((e: unknown) => e);
  expect(error).toBeInstanceOf(TweetFetchError);
  expect((error as TweetFetchError).reason).toBe(reason);
};

describe("fetchTweet", () => {
  it("chama o endereço certo e devolve o post", async () => {
    const fetchFn = vi.fn().mockResolvedValue(json({ code: 200, tweet: { text: "oi" } }));
    await expect(fetchTweet(ref, fetchFn)).resolves.toEqual({ text: "oi" });
    expect(fetchFn).toHaveBeenCalledWith("https://api.fxtwitter.com/olucascorte/status/123");
  });

  it("trata falha de rede", async () => {
    const fetchFn = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    await expectReason(fetchTweet(ref, fetchFn), "network");
  });

  it("trata 404 no corpo mesmo com HTTP 200", async () => {
    const fetchFn = vi.fn().mockResolvedValue(json({ code: 404, tweet: null }));
    await expectReason(fetchTweet(ref, fetchFn), "not-found");
  });

  it("trata HTTP 404", async () => {
    const fetchFn = vi.fn().mockResolvedValue(json({ code: 404 }, 404));
    await expectReason(fetchTweet(ref, fetchFn), "not-found");
  });

  it("trata limite de requisições (429)", async () => {
    const fetchFn = vi.fn().mockResolvedValue(json({}, 429));
    await expectReason(fetchTweet(ref, fetchFn), "rate-limit");
  });

  it("trata resposta que não é JSON", async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response("<html>erro</html>", { status: 200 }));
    await expectReason(fetchTweet(ref, fetchFn), "unknown");
  });

  it("trata erro do servidor", async () => {
    const fetchFn = vi.fn().mockResolvedValue(json({ tweet: { text: "x" } }, 500));
    await expectReason(fetchTweet(ref, fetchFn), "unknown");
  });
});
