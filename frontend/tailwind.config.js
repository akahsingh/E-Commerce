/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        amazon: {
          DEFAULT: "#131921",
          light: "#232F3E",
          mid: "#37475A",
          orange: "#FF9900",
          yellow: "#FFD814",
          "yellow-hover": "#F7CA00",
          "btn-orange": "#FFA41C",
          "btn-orange-hover": "#FA8900",
          "search-bg": "#FEBD69",
          "search-hover": "#F3A847",
          link: "#007185",
          "link-hover": "#C7511F",
          "price-red": "#CC0C39",
          star: "#FFA41C",
          page: "#E3E6E6",
          "page-alt": "#F5F5F5",
          text: "#0F1111",
          "text-secondary": "#565959",
          "cart-badge": "#F08804",
        },
      },
      fontFamily: {
        amazon: ["Arial", "sans-serif"],
      },
      maxWidth: {
        "screen-amazon": "1500px",
      },
    },
  },
  plugins: [],
};
