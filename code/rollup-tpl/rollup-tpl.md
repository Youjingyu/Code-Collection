### rollup打包模板
```json
# package.json
{
  "scripts": {
    "build": "rm -rf ./dist && NODE_ENV=production rollup -c rollup.config.js",
    "dev": "rm -rf ./dist &&NODE_ENV=development rollup -c rollup.config.js -w ./src",
  }
}
```
```javascript
// rollup.config.js
import babel from 'rollup-plugin-babel'
// import multiEntry from 'rollup-plugin-multi-entry'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import vue from 'rollup-plugin-vue2'
import css from 'rollup-plugin-css-only'
import copy from 'rollup-plugin-copy'
import uglify from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import path from 'path'

const isProduction = process.env.NODE_ENV === 'production'
const globby = require('globby')

var plugins = [
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.VUE_ENV': JSON.stringify('browser')
  }),
  babel({
    babelrc: false,
    exclude: 'node_modules/**',
    presets: ['es2015-rollup', 'stage-0'],
    plugins: ['transform-class-properties']
  }),
  resolve({
    browser: true,
    jsnext: true,
    main: true
  }), commonjs()
]

if (isProduction) {
  plugins = plugins.concat([
    uglify()
  ])
} else {
  plugins = plugins.concat([
    serve({
      contentBase: 'dist',
      open: true
    }),
    livereload('dist')
  ])
}

copy({
  'src/ui/buryConsole/index.html': 'dist/ui/buryConsole/index.html',
  'src/ui/configList/index.html': 'dist/ui/configList/index.html',
  'src/ui/groupList/index.html': 'dist/ui/groupList/index.html',
  'src/index.html': 'dist/index.html',
  'src/sdk/benchmark.html': 'dist/sdk/benchmark.html',
  'test': 'dist/test',
  'node_modules/element-ui/lib/theme-chalk/fonts': 'dist/ui/configList/fonts',
  verbose: true
}).ongenerate()

const configs = globby.sync(['src/sdk/index.js', 'src/ui/*/index.js', '!src/backend']).map((inputFile) => {
  var name = path.basename(inputFile, '.js')
  return {
    input: inputFile,
    output: {
      file: inputFile.replace(/src\/(.*?)\/(.*?)\.js/, 'dist/$1/$2.js'),
      name: name,
      format: 'umd'
    },
    // 对于多个入口，vue、css插件需要单独实例化
    // 否则css不能分别打包到各个入口的dist目录
    plugins: [vue(), css()].concat(plugins)
  }
})

module.exports = configs

```