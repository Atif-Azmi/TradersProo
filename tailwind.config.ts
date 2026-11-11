import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border, #CAC8C0)",
        input: "var(--border, #CAC8C0)",
        ring: "#88A993",
        background: "var(--background, #E0DCD6)",
        foreground: "var(--ink, #3E3B36)",
        surface: "var(--surface, #E9E4DE)",
        surfaceRaised: "var(--surface-raised, #F2EEE9)",
        ink: {
          DEFAULT: "var(--ink, #3E3B36)",
          secondary: "var(--ink-secondary, #7A756F)",
          muted: "var(--disabled, #A09B94)",
        },
        primary: {
          DEFAULT: "#B4E0CA",
          pressed: "#9CCDB4",
          strong: "#88A993",
          foreground: "#1E3121",
        },
        onPrimary: "#1E3121",
        mint: {
          DEFAULT: "#B4E0CA",
          pressed: "#9CCDB4",
          strong: "#88A993",
          text: "#1E3121",
        },
        warning: {
          DEFAULT: "#E3D094",
          text: "#4A3F12",
        },
        danger: {
          DEFAULT: "#D98A7B",
          text: "#4A1D14",
        },
        info: {
          DEFAULT: "#9DB8C9",
          text: "#1F3441",
        },
        secondary: {
          DEFAULT: "var(--surface, #E9E4DE)",
          foreground: "var(--ink, #3E3B36)",
        },
        destructive: {
          DEFAULT: "#D98A7B",
          foreground: "#4A1D14",
        },
        muted: {
          DEFAULT: "var(--surfaceRaised, #F2EEE9)",
          foreground: "var(--ink-secondary, #7A756F)",
        },
        accent: {
          DEFAULT: "#B4E0CA",
          foreground: "#1E3121",
        },
        popover: {
          DEFAULT: "var(--surface, #E9E4DE)",
          foreground: "var(--ink, #3E3B36)",
        },
        card: {
          DEFAULT: "var(--surface, #E9E4DE)",
          foreground: "var(--ink, #3E3B36)",
        },
      },
      borderRadius: {
        pill: "9999px",
        card: "20px",
        "card-lg": "24px",
        sheet: "28px",
        "sheet-lg": "32px",
        "token-sm": "12px",
      },
      boxShadow: {
        "warm-card": "0 8px 24px -4px rgba(62, 59, 54, 0.08)",
        "warm-raised": "0 12px 32px -6px rgba(62, 59, 54, 0.12)",
        "warm-pill": "0 4px 16px -2px rgba(62, 59, 54, 0.10)",
      },
    },
  },
  plugins: [],
};
export default config;
