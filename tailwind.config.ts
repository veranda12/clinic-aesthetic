import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    // Reset the default palette so the design never falls back to Tailwind blues/greys.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      ivory: "#F5F0E8",
      paper: "#FBF9F4",
      cream: "#EFE7DA",
      ink: "#2B2825",
      "ink-soft": "#4A443D",
      taupe: "#8C8073",
      "taupe-light": "#B4A896",
      line: "#E3D8C9",
      "line-soft": "#ECE3D6",
      olive: "#5E6248",
      "olive-deep": "#494D38",
      clay: "#A8694E",
      blush: "#EADFD6",
      white: "#FFFFFF",
      black: "#000000",
      danger: "#9A3B2E",
      success: "#4F6146",
    },
    borderRadius: {
      none: "0",
      xs: "2px",
      sm: "3px",
      DEFAULT: "4px",
      md: "6px",
      lg: "10px",
      full: "9999px",
    },
    fontFamily: {
      display: ["var(--font-display)", "Georgia", "serif"],
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
    },
    extend: {
      fontSize: {
        eyebrow: ["0.72rem", { lineHeight: "1", letterSpacing: "0.22em" }],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      maxWidth: {
        prose2: "68ch",
        shell: "1360px",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
