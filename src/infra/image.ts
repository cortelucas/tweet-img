export const readAsDataUrl = (file: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

/** Reduz a imagem (máx. 1600px) para caber no localStorage. */
export const shrink = (dataUrl: string, max = 1600): Promise<string> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * k);
      canvas.height = Math.round(img.height * k);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/webp", 0.9));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });

/** Baixa uma imagem remota como File (exige que o servidor permita CORS). */
export const fetchImageFile = async (url: string, name: string, fetchFn: typeof fetch = fetch): Promise<File> => {
  const res = await fetchFn(url);
  if (!res.ok) throw new Error(`Falha ao baixar a imagem (${res.status})`);
  const blob = await res.blob();
  return new File([blob], name, { type: blob.type || "image/jpeg" });
};