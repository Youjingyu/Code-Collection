module.exports = {
  entry: ['./test/test-code/index.test.js'],
  output: {
    filename: 'test/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', {
                'modules': false,
                'targets': {
                  'browsers': ['> 1%', 'last 2 versions', 'not ie <= 8']
                }
              }]
            ]
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: __dirname,
    open: true,
    port: 9000,
    noInfo: true
  }
}
