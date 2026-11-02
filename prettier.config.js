/** @type {import('prettier').Config} */
const config = {
  plugins: ['prettier-plugin-astro'],
  singleQuote: true,
  experimentalTernaries: true,
  experimentalOperatorPosition: 'start',
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
