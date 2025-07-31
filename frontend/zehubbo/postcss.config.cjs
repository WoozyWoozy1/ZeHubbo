// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},   // ← use this, not "tailwindcss"
    autoprefixer: {},
  },
};
