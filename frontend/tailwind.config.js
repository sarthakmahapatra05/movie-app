/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      maxWidth: {
        app: '390px'
      },
      colors: {
        bg: '#F4F6FB',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#5B4FE9',
          dark: '#473DD0',
          light: '#EDEBFC'
        },
        ink: {
          DEFAULT: '#1E1F2B',
          muted: '#6B7180',
          faint: '#A2A7B3'
        },
        occupied: '#9AA1B0',
        outline: '#D8DCE6',
        success: '#1FAE6E',
        danger: '#E14D4D'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        card: '0 8px 24px -8px rgba(30,31,43,0.08)'
      }
    }
  },
  plugins: []
};
