import { toPng } from "html-to-image";

export const downloadPng = async (node: HTMLElement, filename = "tweet-1080.png"): Promise<void> => {
  const dataUrl = await toPng(node, {
    width: 1080,
    height: 1080,
    pixelRatio: 1,
    cacheBust: true,
    style: { transform: "none" }, // exporta sempre em 1080x1080 reais
  });
  const a = document.createElement("a");
  a.download = filename;
  a.href = dataUrl;
  a.click();
};
