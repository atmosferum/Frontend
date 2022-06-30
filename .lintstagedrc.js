const path = require('path');

const buildEslintCommand = (filenames) =>
  `yarn eslint ${filenames.map((f) => path.relative(process.cwd(), f)).join(' --fix ')} `;

const buildPrettierCommand = (filenames) =>
  `yarn prettier --write ${filenames.map((f) => path.relative(process.cwd(), f)).join(' ')} `;

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, buildPrettierCommand, 'yarn typecheck'],
  '*.scss': ['prettier --write'],
};
