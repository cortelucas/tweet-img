import { describe, expect, it } from "vitest";
import { parseTweetUrl } from "./tweet-url";

const expected = { username: "olucascorte", id: "1234567890123456789" };

describe("parseTweetUrl", () => {
  describe("links válidos", () => {
    it.each([
      ["x.com", "https://x.com/olucascorte/status/1234567890123456789"],
      ["twitter.com", "https://twitter.com/olucascorte/status/1234567890123456789"],
      ["com www", "https://www.x.com/olucascorte/status/1234567890123456789"],
      ["mobile", "https://mobile.twitter.com/olucascorte/status/1234567890123456789"],
      ["sem protocolo", "x.com/olucascorte/status/1234567890123456789"],
      ["com http", "http://x.com/olucascorte/status/1234567890123456789"],
      ["com query string", "https://x.com/olucascorte/status/1234567890123456789?s=20&t=abc"],
      ["com barra final", "https://x.com/olucascorte/status/1234567890123456789/"],
      ["com sufixo de mídia", "https://x.com/olucascorte/status/1234567890123456789/photo/1"],
      ["com espaços ao redor", "  https://x.com/olucascorte/status/1234567890123456789  \n"],
      ["host em maiúsculas", "https://X.COM/olucascorte/status/1234567890123456789"],
      ["fxtwitter", "https://fxtwitter.com/olucascorte/status/1234567890123456789"],
      ["fixupx", "https://fixupx.com/olucascorte/status/1234567890123456789"],
      ["formato antigo (statuses)", "https://twitter.com/olucascorte/statuses/1234567890123456789"],
    ])("aceita %s", (_nome, link) => {
      expect(parseTweetUrl(link)).toEqual(expected);
    });

    it("aceita o formato /i/status/ID", () => {
      expect(parseTweetUrl("https://x.com/i/status/42")).toEqual({ username: "i", id: "42" });
    });

    it("aceita o formato /i/web/status/ID", () => {
      expect(parseTweetUrl("https://x.com/i/web/status/42")).toEqual({ username: "i", id: "42" });
    });

    it("aceita usuário com underscore e números", () => {
      expect(parseTweetUrl("https://x.com/user_name_01/status/7")).toEqual({ username: "user_name_01", id: "7" });
    });
  });

  describe("links inválidos", () => {
    it.each([
      ["texto vazio", ""],
      ["só espaços", "   "],
      ["texto comum", "olá, mundo"],
      ["outro domínio", "https://example.com/olucascorte/status/123"],
      ["domínio parecido", "https://notx.com/olucascorte/status/123"],
      ["subdomínio enganoso", "https://x.com.evil.com/olucascorte/status/123"],
      ["perfil sem post", "https://x.com/olucascorte"],
      ["sem id", "https://x.com/olucascorte/status/"],
      ["id não numérico", "https://x.com/olucascorte/status/abc"],
      ["usuário com mais de 15 caracteres", "https://x.com/usuario_muito_longo_demais/status/123"],
      ["usuário com caractere inválido", "https://x.com/user-name/status/123"],
      ["outro tipo de página", "https://x.com/olucascorte/likes/123"],
      ["esquema perigoso", "javascript:alert(1)"],
    ])("rejeita %s", (_nome, link) => {
      expect(parseTweetUrl(link)).toBeNull();
    });
  });
});
