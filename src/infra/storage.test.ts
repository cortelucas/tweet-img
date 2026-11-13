// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearAll, loadImage, loadState, saveImage, saveState } from "./storage";

beforeEach(() => localStorage.clear());
afterEach(() => vi.restoreAllMocks());

describe("state", () => {
  it("devolve objeto vazio quando não há nada salvo", () => {
    expect(loadState()).toEqual({});
  });

  it("salva e recupera o estado", () => {
    saveState({ name: "Lucas", theme: "dim", iconsOnly: true });
    expect(loadState()).toEqual({ name: "Lucas", theme: "dim", iconsOnly: true });
  });

  it("devolve objeto vazio quando o JSON salvo está corrompido", () => {
    localStorage.setItem("tweet-img:v1", "{quebrado");
    expect(loadState()).toEqual({});
  });
});

describe("images", () => {
  it("devolve null quando não há imagem salva", () => {
    expect(loadImage("avatar")).toBeNull();
  });

  it("salva e recupera a imagem", () => {
    expect(saveImage("photo", { data: "data:image/webp;base64,AAA", name: "foto.png" })).toBe(true);
    expect(loadImage("photo")).toEqual({ data: "data:image/webp;base64,AAA", name: "foto.png" });
  });

  it("devolve false quando o localStorage estoura a cota", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("cheio", "QuotaExceededError");
    });
    expect(saveImage("photo", { data: "x", name: "a.png" })).toBe(false);
  });
});

describe("clearAll", () => {
  it("remove só as chaves do app", () => {
    saveState({ name: "Lucas" });
    saveImage("avatar", { data: "x", name: "a.png" });
    localStorage.setItem("outra-chave", "fica");

    clearAll();

    expect(loadState()).toEqual({});
    expect(loadImage("avatar")).toBeNull();
    expect(localStorage.getItem("outra-chave")).toBe("fica");
  });
});
