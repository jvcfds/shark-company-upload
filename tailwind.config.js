/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#011b1e",
        layer_green_1: "#01292D",
        layer_green_2: "#073B3E",
        layer_green_3: "#00494D",
        gold_layer: "#B97E68"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
