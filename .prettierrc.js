module.exports = {
  quoteProps: "consistent",
  bracketSpacing: false,
  endOfLine: "auto",
  trailingComma: "all",
  tabWidth: 2,
  semi: true,
  printWidth: 80,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
