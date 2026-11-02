/** @type {import('prettier').Config} */
const config = {
  plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
  singleQuote: true,
  experimentalTernaries: true,
  experimentalOperatorPosition: 'start',
  tailwindStylesheet: './src/styles/global.css',
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
};

export default config;
