import daisyui from "daisyui";
/** @type {import('tailwindcss').Config} */
//import daisyUIThemes from "daisyui/src/theming/themes";
/* @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      margin: "0",
      center: true,
      padding: "2rem",
      screens: {
        xl: "1272px",
        "2xl": "1272px",
      },
    },
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark", "cupcake"], // Choose your preferred themes
  },
};
