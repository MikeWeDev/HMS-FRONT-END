// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  // 🔑 ADD THIS LINE to enable class-based dark mode
  darkMode: 'class', 
  
  // You must ensure the 'content' array includes all your files (like the sidebar)
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Your custom theme extensions go here
    },
  },
  plugins: [
    // Your Tailwind plugins go here
  ],
};