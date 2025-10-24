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
        primary: "#d6771f",
        background: {
          light: "#fdfbf5",
          dark: "#211911",
        },
        surface: {
          light: "#ffffff",
          dark: "#2c231a",
          subtle: {
            light: "#f4f2f0",
            dark: "#3a3025",
          },
        },
        text: {
          crust: "#4A2E2A",
          light: "#4A2E2A",
          dark: "#fdfbf5",
          muted: {
            light: "#877564",
            dark: "#a19182",
          },
        },
        accent: {
          dough: "#EFE8D8",
          wheat: "#F7B500",
          olive: "#6b7f39",
        },
        border: {
          light: "#e5e0dc",
          dark: "#3a3024",
        },
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
        heading: ["Playfair Display", "serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-in-out",
        "slide-up": "slide-up 0.4s ease-out",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [],
};
export default config;
