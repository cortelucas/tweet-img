import { describe, expect, it, vi } from "vitest";
import { fetchImageFile } from "./image";

describe("fetchImageFile", () => {
  it("devolve um File com o tipo e o nome informados", async () => {
    const body = new Blob(["abc"], { type: "image/png" });
    const fetchFn = vi.fn().mockResolvedValue(new Response(body, { status: 200 }));

    const file = await fetchImageFile("https://pbs.twimg.com/a.png", "foto.png", fetchFn);

    expect(fetchFn).toHaveBeenCalledWith("https://pbs.twimg.com/a.png");
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe("foto.png");
    expect(file.type).toBe("image/png");
    expect(file.size).toBe(3);
  });

  it("assume JPEG quando o servidor não informa o tipo", async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response(new Blob(["x"]), { status: 200 }));
    const file = await fetchImageFile("https://x/img", "foto", fetchFn);
    expect(file.type).toBe("image/jpeg");
  });

  it("falha quando a resposta não é ok", async () => {
    const fetchFn = vi.fn().mockResolvedValue(new Response("", { status: 403 }));
    await expect(fetchImageFile("https://x/img", "foto", fetchFn)).rejects.toThrow("403");
  });

  it("propaga erro de rede (por exemplo, CORS)", async () => {
    const fetchFn = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(fetchImageFile("https://x/img", "foto", fetchFn)).rejects.toThrow("Failed to fetch");
  });
});
