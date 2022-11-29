module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./src/index.html"],
  mode: "jit",
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ["Open Sans", "sans-serif"],
      body: ["Open Sans", "sans-serif"],
    },
    extend: {
      colors: {
        'box': '#081128',
        'box-active':'#0c1c42',
        'box-hover':'#0d1b3d'
      },
      screens: {
        'xs': '400px',
        mf: "990px",
        '3xl': '1600px',
      },
      keyframes: {
        "slide-in": {
          "0%": {
            "-webkit-transform": "translateX(120%)",
            transform: "translateX(120%)",
          },
          "100%": {
            "-webkit-transform": "translateX(0%)",
            transform: "translateX(0%)",
          },
        },
      },
      animation: {
        "slide-in": "slide-in 0.5s ease-out",
      },
    },
  },
  variants: {
    extend: {},
  },
  // plugins: [require("@tailwindcss/forms")],
};