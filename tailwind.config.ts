import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        caritas: {
          red: "var(--red)",
          crimson: "var(--crimson)",
          gold: "var(--gold)",
          cream: "var(--cream)",
          dark: "var(--dark)",
          maroon: "var(--maroon)",
          rose: "#F5E6E6",
        },
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        playfair: ["Playfair Display", "serif"],
        garamond: ["EB Garamond", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.8s ease-in-out",
        "slide-up": "slideUp 0.8s ease-out",
        "candle-flicker": "candleFlicker 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: { "0%": { opacity: "0", transform: "translateY(30px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        candleFlicker: { "0%, 100%": { opacity: "1" }, "50%": { opacity: "0.8" } },
        float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
      },
      backgroundImage: {
        "cross-pattern": "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18 0h4v40h-4zM0 18h40v4H0z' fill='%23D4AF37' fill-opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
export default config;
