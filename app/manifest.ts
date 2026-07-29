import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Abu Taymeeyah Academy",
    short_name: "Abu Taymeeyah",
    description:
      "Qur'anic Memorisation & Training Institute — structured Qur'an memorization, Tajweed mastery, and Islamic learning.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0F1E3D",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
