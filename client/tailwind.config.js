module.exports = {
  mode: "jit",
  purge: ["src/**/*.tsx", "public/index.html"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
