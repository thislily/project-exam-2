module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ["Mulish"],
        heading: ["Fredoka"],
      },
      boxShadow: { // <-- Correct key name
        md: "0 10px 15px rgba(0, 0, 0, 0.1)",
      },
      colors: {
        "breeze": "#BDD9BF",
        "breeze-dark": "#5A6F63",
        "harbour": "#2E4052",
        "harbour-dark": "#1B2730",
        "sunbeam": "#FFC857",
        "sunbeam-dark": "#CC9C3E",
        "white": "#FFFFFF",
        "black": "#000000",
        "gray-100": "#ECECEC",
        "gray-300": "#D5D5D5",
        "gray-600": "#969696",
        "gray-800": "#6C757D",
        "gray-900": "#333333",
        "warning": "#CA4345",
        "success": "#008D49",
      },
      animation: {
        'loading-bar': 'loading-bar 1.5s ease-in-out infinite',
      },
      keyframes: {
        'loading-bar': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
