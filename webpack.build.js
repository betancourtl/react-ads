const path = require('path');
const config = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: 'react-ads',
    libraryTarget: 'commonjs2',
    umdNamedDefine: true,  
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: [
          '/node_modules/',
          /.spec\.jsx?/
        ],
        use: { 
          loader: 'babel-loader'
        },
      }
    ]
  },
};

module.exports = config;
