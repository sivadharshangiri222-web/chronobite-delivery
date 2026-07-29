/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        base: '#111214',
        surface: '#1C1E22',
        elevated: '#25282E',
        hover: '#2E3138',
        orange: {
          primary: '#E87722',
          hover: '#D06A18',
          soft: 'rgba(232, 119, 34, 0.12)'
        },
        textPrimary: '#F0F0F0',
        textSecondary: '#9A9DA6',
        textMuted: '#55585F'
      },
      fontFamily: {
        display: ['Poppins', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px'
      },
      boxShadow: {
        'orange-glow': '0 4px 20px rgba(232, 119, 34, 0.3)',
        'orange-sm': '0 2px 10px rgba(232, 119, 34, 0.2)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.4)'
      }
    }
  },
  plugins: []
};
