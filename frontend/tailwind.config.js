/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        amazon: {
          DEFAULT: "#4F46E5",
          light: "#1E1B4B",
          mid: "#312E81",
          orange: "#F43F5E",
          yellow: "#4F46E5",
          "yellow-hover": "#4338CA",
          "btn-orange": "#F43F5E",
          "btn-orange-hover": "#E11D48",
          "search-bg": "#EEF2FF",
          "search-hover": "#E0E7FF",
          link: "#4F46E5",
          "link-hover": "#4338CA",
          "price-red": "#F43F5E",
          star: "#F59E0B",
          page: "#F1F5F9",
          "page-alt": "#FFFFFF",
          text: "#0F172A",
          "text-secondary": "#64748B",
          "cart-badge": "#F43F5E",
        },
      },
      fontFamily: {
        amazon: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        "screen-amazon": "1500px",
      },
    },
  },
  plugins: [],
};
