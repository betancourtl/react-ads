module.exports = (api) => {
  api.cache(true);

  const presets = [
    '@babel/preset-env',
    '@babel/preset-react',
  ];

  const plugins = [
    '@babel/plugin-proposal-class-properties',
  ];

  const devPresets = presets.concat('minify');
  const devPlugins = plugins.concat('transform-react-remove-prop-types');

  return {
    env: {
      test: {
        presets,
        plugins,
      },
      development: {
        presets,
        plugins,
      },
      production: {
        presets: devPresets,
        plugins: devPlugins,
        comments: false,
      }
    },
  };
};
