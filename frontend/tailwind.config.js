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
      fontSize: {
        xs:   ["0.8125rem",  { lineHeight: "1.125rem" }],   // 13px (was 12px)
        sm:   ["0.9375rem",  { lineHeight: "1.4rem" }],     // 15px (was 14px)
        base: ["1.0625rem",  { lineHeight: "1.65rem" }],    // 17px (was 16px)
        lg:   ["1.1875rem",  { lineHeight: "1.8rem" }],     // 19px (was 18px)
        xl:   ["1.3125rem",  { lineHeight: "1.9rem" }],     // 21px (was 20px)
        "2xl":["1.5625rem",  { lineHeight: "2.1rem" }],     // 25px (was 24px)
        "3xl":["1.9375rem",  { lineHeight: "2.35rem" }],    // 31px (was 30px)
      },
      maxWidth: {
        "screen-amazon": "1500px",
      },
    },
  },
  plugins: [],
};
