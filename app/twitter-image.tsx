import { generateSocialImage, OG_IMAGE_SIZE } from "@/lib/og-image";

export const runtime = "nodejs";
export const alt = "Abu Taymeeyah Academy — Qur'anic Memorisation & Training";
export const size = OG_IMAGE_SIZE;
export const contentType = "image/png";

export default async function Image() {
  return generateSocialImage();
}
