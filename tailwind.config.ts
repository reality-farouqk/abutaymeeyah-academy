import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0F1E3D",
          deep: "#0A1530",
          light: "#1B2F5C",
        },
        gold: {
          DEFAULT: "#C6942F",
          light: "#E8C878",
          dim: "#9C7526",
        },
        mist: "#EEF2F9",
        paper: "#FBFCFE",
        ink: "#10131A",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "navy-gradient": "linear-gradient(160deg, #0A1530 0%, #16295A 55%, #0F1E3D 100%)",
      },
      boxShadow: {
        arch: "0 20px 40px -18px rgba(15, 30, 61, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
