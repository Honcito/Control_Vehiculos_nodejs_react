// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}", // Asegúrate de incluir esto
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Jost", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["abyss", "nord"], // <- Correctamente escrito
  },
};
