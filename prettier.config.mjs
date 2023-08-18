/** @type {import("prettier").Options} */
export default {
  // Base
  semi: false,
  singleQuote: true,

  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-tailwindcss', // MUST come last
  ],

  tailwindFunctions: ['classList'],

  importOrder: ['<THIRD_PARTY_MODULES>', '', '^/?(~|src)/', '', '^[./]'],
}
