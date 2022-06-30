const path = require("path");

const buildEslintCommand = (filenames) =>
  `yarn eslint ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --fix ")} `;

module.exports = {
  "*.{js,jsx,ts,tsx}": [buildEslintCommand, "yarn typecheck"],
  "*.scss": ["prettier --write"],
};
