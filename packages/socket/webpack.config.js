const path = require('path');

module.exports = {
  entry: './src/socket.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    libraryTarget: 'umd',
    filename: 'socket.js',
    path: path.resolve(__dirname, 'dist')
  }
};
