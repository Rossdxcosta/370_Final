/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: 'class',
  purge: {
    enabled: true,
    content: [
      "./src/**/*.{html,ts}",
      "./**/*.html",
      "./node_modules/flowbite/**/*.js",
    ],
  },
  theme: {
    extend: {},
    screens: {
      sm: "375px",
      lg: "1440px",
    },
    colors: {
      "very-dark-grey": "hsl(0, 0%, 17%)",
      "dark-grey": "hsl(0, 0%, 59%)",
    },
    fontFamily: {
      sans: ["Rubik", "sans-serif"],
      /* fontFamily: {
      'body': [
        "Montserrat"
      ],
      sans: [
        "Montserrat"
      ] */
    },
  },
  plugins: [
    require("postcss-import"),
    require("tailwindcss"),
    require("autoprefixer"),
    require('flowbite/plugin'),
    "prettier-plugin-tailwindcss"
  ],
};