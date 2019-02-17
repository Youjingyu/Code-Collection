const serve = require('/usr/local/lib/node_modules/rollup-plugin-serve')
const livereload = require('/usr/local/lib/node_modules/rollup-plugin-livereload')

export default {
  input: './src/index.js',
  output: {
    format: 'iife',
    name: 'mvvm',
    file: './dist/bundle.js'
  },
  plugins: [
    serve(),
    livereload()
  ]
}
