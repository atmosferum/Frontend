const path = require('path');
module.exports = {
  stories: ['../src/components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    'storybook-addon-sass-postcss',
    `@storybook/preset-create-react-app`,
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  webpackFinal: async (config) => {
    const { module = {} } = config;

    const newConfig = {
      ...config,
      module: {
        ...module,
        rules: [...(module.rules || [])],
      },
    };

    newConfig.module.rules.find((rule) => rule.test.toString().includes('scss')).exclude =
      /\.module\.(s?)css$/;

    newConfig.module.rules.push({
      test: /\.module\.s?css$/,
      include: path.resolve(__dirname, '../components'),
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 1,
          },
        },
        'sass-loader',
      ],
    });

    console.log(newConfig.module.rules);

    return newConfig;
  },
};
