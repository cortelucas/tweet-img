export const formatDate = (date: Date = new Date()): string =>
  date
    .toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" })
    .replace(".", "");