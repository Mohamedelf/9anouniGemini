/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Configure the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#007AFF', // Example primary color
        secondary: '#5856D6',
      },
    },
  },
  plugins: [],
};