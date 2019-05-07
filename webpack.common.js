const path = require('path');

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src', 'main.js'),
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
  }
};
