/**
 * Slug generation helper wrapping the `slugify` npm package with project defaults.
 * Always produces lowercase, hyphenated slugs safe for URLs and DB indexes.
 */
const slugifyLib = require('slugify');

/**
 * Generate a URL-safe slug from a string.
 * @param {string} text
 * @returns {string}
 */
const generateSlug = (text) =>
  slugifyLib(text, {
    lower: true,
    strict: true,   // strips special characters
    trim: true,
  });

module.exports = generateSlug;
