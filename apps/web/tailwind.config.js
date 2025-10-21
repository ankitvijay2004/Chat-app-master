/** @type {import('tailwindcss').Config} */
sharedConfig = require('tailwind-config/tailwind.config.js')
// {
// content: [
//   "./app/**/*.{js,ts,jsx,tsx,mdx}",
//   "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//   "./components/**/*.{js,ts,jsx,tsx,mdx}",

//   // Or if using `src` directory:
//   "./src/**/*.{js,ts,jsx,tsx,mdx}",
// ],
// theme: {
//   extend: {},
// },
// plugins: [],
// }

module.exports = {
  ...sharedConfig,
  content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    
      // Or if using `src` directory:
      "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          "0%": { opacity: 0, transform: "translateX(-100%)" }, // Start from off-screen left
          "100%": { opacity: 1, transform: "translateX(100%)" }   // End at the default position

        }
      },
      animation: {
        slideIn: "slideIn .25s ease-in-out forwards var(--delay, 0)"
      }
    }
  }
  ,
  plugins: [
    require('tailwind-scrollbar-hide')
    // ...
  ]
}