const path = require('path');

module.exports = {
  entry: {
    wheel: path.resolve(__dirname, 'build', 'javascript', '.js'),
  },
  output: {
    path: path.resolve(__dirname, 'docs', 'javascript'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};