/**
 * postcss.config.cjs
 *
 * PostCSS configuration for the CryptoInsightHub project.
 *
 * Ensure these dev dependencies are installed:
 *   npm install -D postcss tailwindcss autoprefixer postcss-nesting
 *
 * This config loads PostCSS Nesting, Tailwind CSS and Autoprefixer so the
 * `@tailwind` directives and nested rules in `src/index.css` are processed
 * during development and build.
 */

module.exports = {
  plugins: {
    // Enable CSS nesting support (PostCSS Nesting)
    "postcss-nesting": {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
