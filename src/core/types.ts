export type Theme = "light" | "dim" | "dark";
export type Ratio = "1 / 1" | "4 / 3" | "16 / 9";

export const STAT_IDS = ["replies", "reposts", "likes", "views"] as const;
export type StatId = (typeof STAT_IDS)[number];

export const FIELD_IDS = ["name", "handle", "text", "watermark", "theme", "ratio", ...STAT_IDS] as const;
export type FieldId = (typeof FIELD_IDS)[number];

export const IMAGE_IDS = ["avatar", "photo"] as const;
export type ImageId = (typeof IMAGE_IDS)[number];

export type AppState = Partial<Record<FieldId, string>> & { iconsOnly?: boolean };

export interface StoredImage {
  data: string;
  name: string;
}
