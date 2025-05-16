/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#009de0', // Main blue color
        'primary-light': '#ebf7fd', // Light blue color
        'text-dark': '#202125', // Dark text color
        'text-gray': '#717173', // Gray text color
        // Use Tailwind's default white color for white
      },
      maxWidth: {
        '7xl': '95rem', // Customizing max-w-7xl to be 95rem instead of default 80rem
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'none': 'none',
      },
      backgroundColor: {
        'primary': '#009de0',
        'primary-light': '#ebf7fd',
      },
      textColor: {
        'primary': '#009de0',
        'primary-light': '#ebf7fd',
        'text-dark': '#202125',
        'text-gray': '#717173',
      },
      borderColor: {
        'primary': '#009de0',
        'primary-light': '#ebf7fd',
      },
    },
  },
  plugins: [],
} 