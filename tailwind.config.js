module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}', './app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'primary-1': 'var(--primary_1)',
      },
      screens: {
        t: "768px",
        d: "1440px",
      },
    },
  },
    plugins: [],
  };
  