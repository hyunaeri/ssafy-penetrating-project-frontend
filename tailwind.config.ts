import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "HannaAir",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Noto Sans CJK KR",
          "Noto Sans CJK SC",
          "sans-serif",
        ],
        euljiro: ["Euljiro", "HannaAir", "Pretendard", "sans-serif"],
      },
      colors: {
        ink: "#2b2d42",
        muted: "#8b95a1",
        line: "#eef0f3",
        surface: "#f7f8fa",
        canvas: "#eef1f5",
        brand: {
          DEFAULT: "#2ac1bc",
          light: "#e8fafa",
          soft: "#f0fbfb",
          dark: "#1fb5b0",
        },
        accent: {
          warm: "#fff4e6",
          "warm-text": "#c27803",
          purple: "#f3f0ff",
          "purple-text": "#6d5ce7",
          blue: "#eef6ff",
          "blue-text": "#2b6cb0",
        },
      },
      maxWidth: {
        mobile: "430px",
      },
      borderRadius: {
        card: "1.25rem",
        button: "1rem",
        shell: "1.75rem",
      },
      boxShadow: {
        soft: "0 4px 24px rgba(43, 45, 66, 0.06)",
        card: "0 2px 16px rgba(43, 45, 66, 0.07)",
        nav: "0 -4px 24px rgba(43, 45, 66, 0.05)",
        float: "0 8px 28px rgba(42, 193, 188, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
