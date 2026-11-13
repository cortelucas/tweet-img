import { formatDate } from "../core/date";
import { mapTweet, type ImportedTweet } from "../core/tweet-data";
import { parseTweetUrl } from "../core/tweet-url";
import { STAT_IDS } from "../core/types";
import { TweetFetchError, fetchTweet } from "../infra/fxtwitter";
import { fetchImageFile } from "../infra/image";
import { $, type FormControl } from "./dom";
import type { ImageControl } from "./uploads";

type StatusKind = "info" | "ok" | "error";

/** Preenche o campo e dispara "input" para os bindings (preview e localStorage) reagirem. */
const setValue = (id: string, value: string): void => {
  const el = $<FormControl>(id);
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true }));
};

const fillFields = (tweet: ImportedTweet): void => {
  if (tweet.name) setValue("name", tweet.name);
  if (tweet.handle) setValue("handle", tweet.handle);
  setValue("text", tweet.text);
  if (tweet.createdAt) setValue("datetime", formatDate(tweet.createdAt));
  for (const id of STAT_IDS) setValue(id, tweet.stats[id]);
};

/** Devolve true se a imagem foi carregada; sem URL, limpa a anterior. */
const loadImage = async (control: ImageControl, url: string | null, name: string): Promise<boolean> => {
  if (!url) {
    control.clear();
    return true;
  }
  try {
    await control.load(await fetchImageFile(url, name));
    return true;
  } catch (err) {
    console.warn(`Não foi possível carregar ${name}:`, err);
    return false;
  }
};

export const bindImport = (controls: { avatar: ImageControl; photo: ImageControl }): void => {
  const input = $<HTMLInputElement>("import-url");
  const button = $<HTMLButtonElement>("import-btn");
  const status = $("import-status");

  const show = (message: string, kind: StatusKind): void => {
    status.textContent = message;
    status.dataset.kind = kind;
    status.hidden = false;
  };

  const run = async (): Promise<void> => {
    const ref = parseTweetUrl(input.value);
    if (!ref) {
      show("Link inválido. Use o link de um post, como https://x.com/usuario/status/123.", "error");
      return;
    }

    button.disabled = true;
    show("Buscando o post…", "info");

    try {
      const tweet = mapTweet(await fetchTweet(ref));
      fillFields(tweet);

      const failed: string[] = [];
      if (!(await loadImage(controls.avatar, tweet.avatarUrl, "avatar.jpg"))) failed.push("avatar");
      if (!(await loadImage(controls.photo, tweet.photoUrl, "foto.jpg"))) failed.push("foto");

      show(
        failed.length
          ? `Post importado, mas não foi possível carregar: ${failed.join(" e ")}. Envie manualmente.`
          : "Post importado. Você pode editar os campos.",
        failed.length ? "info" : "ok",
      );
    } catch (err) {
      show(err instanceof TweetFetchError ? err.message : "Não foi possível importar o post.", "error");
    } finally {
      button.disabled = false;
    }
  };

  button.addEventListener("click", () => void run());
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    void run();
  });
};
