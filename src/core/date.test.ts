import { describe, expect, it } from "vitest";
import { formatDate } from "./date";

describe("formatDate", () => {
  it("formata em pt-BR sem o ponto da abreviação do mês", () => {
    expect(formatDate(new Date(2026, 10, 11))).toBe("11 de nov de 2026");
  });

  it("não usa zero à esquerda no dia", () => {
    expect(formatDate(new Date(2026, 0, 5))).toBe("5 de jan de 2026");
  });

  it("usa a data de hoje quando nenhuma é informada", () => {
    expect(formatDate()).toContain(String(new Date().getFullYear()));
  });
});
