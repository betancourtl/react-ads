const path = require('path');

const prebidLoader = {
  test: /.js$/,
  include: new RegExp(`\\${path.sep}prebid\.js`),
  use: {
    loader: 'babel-loader',
    // presets and plugins for Prebid.js must be manually specified separate from your other babel rule.
    // this can be accomplished by requiring prebid's .babelrc.js file (requires Babel 7 and Node v8.9.0+)
    options: require('prebid.js/.babelrc.js')
  }
}

const jsLoader = {
  test: /\.m?js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: [
        '@babel/preset-env',
        '@babel/preset-react',
      ],
      plugins: [
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-proposal-class-properties'
      ]
    }
  }
};

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: 'bidder-[id].js',
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      jsLoader,
      prebidLoader,
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  }
};
