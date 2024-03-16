module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 20s linear infinite',
      }
    },
    colors: {
      bgPrimary : '#141204',
      aquaMarine: '#55d6be',
      persianOrange: '#e8985e'
    }
  },
  prefix: '',
  plugins: [],
}
