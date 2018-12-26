const path = require('path');
const webpack = require('webpack');
const config = {
  resolve: { symlinks: false },
  entry: './examples/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: { 
          loader: 'babel-loader',            
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
            plugins: ["@babel/plugin-proposal-class-properties"]
          }
        },
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: path.join(__dirname, './'),
    historyApiFallback: true,
    port: 3001,
    hot: true
  }
};

module.exports = config;
