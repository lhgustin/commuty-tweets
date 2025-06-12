// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
    trailingComma: "es5",
    tabWidth: 4,
    semi: false,
    singleQuote: true,
    // non default:
    printWidth: 120,
    endOfLine: "lf",
    arrowParens: "always",
    bracketSpacing: true,
    jsxBracketSameLine: false,
    jsxSingleQuote: false,
  };
  
  export default config;