/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FFC107', // Жовтий
        'primary-dark': '#FFA000', // Темно-жовтий
        'primary-light': '#FFD54F', // Світло-жовтий
        dark: '#1A1A1A', // Чорний фон
        'dark-lighter': '#2D2D2D', // Світліше чорний
        'dark-card': '#242424', // Фон карток
      },
    },
  },
  plugins: [],
}
