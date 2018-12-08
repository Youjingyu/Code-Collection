### 前言

webpack 虽然非常火热，但后起之秀 rollup 却慢慢地蚕食着 webpack 的市场；我们已经有了几乎无所不能的 webpack，为什么还要 rollup 呢？

webpack 的配置实在是太复杂了，所以前端社区常戏谑“每个前端团队都需要招聘一个 webpack 配置工程师”；如果我们只是写一个 JavaScript 工具或者库，并不需要打包 image、css，也不需要代码拆分等特性，使用 webpack 未免太过繁琐；这时使用 rollup 就非常适合，rollup 专注于打包 JavaScript，简单明了，易于上手，事实上很多前端流行的库都是使用 rollup 打包的，比如 React、Vue、Moment 等。

### 快速上手

就像其他前端工具一样，我们可以通过 [npm](https://www.npmjs.cn/) 全局安装 rollup，然后在命令行中使用它。

```bash
npm install --global rollup 
```

安装完成后就可以使用 rollup 来打包我们的代码了。首先我们新建一个名为 test-rollup 的目录，然后在命令行中进入该目录，并用 npm 初始化：

```bash
cd test-rollup
npm init # npm会让你输入一些信息，直接回车就行
```

然后我们新建两个 js 文件 main.js、foo.js，分别写入如下代码：

```javascript
// foo.js
export default 'hi rollup'
```

```javascript
// main.js
import foo from './foo.js'
export default function () {
  console.log(foo)
}
```

现在我们使用 rollup 将这两个 js 文件打包为可以直接在浏览器中执行的文件：

```bash
rollup main.js --format iife --name foo --file bundle.js
```

在命令行中执行上面的语句后，就会生成可以直接在浏览器中执行的文件 bundle.js。命令的参数的意义如下：

- main.js 入口文件，rollup会以入口文件为起点分析 JavaScript 代码，将所有代码打包为一个文件
- --format 定义输出的 bundle.js 的格式，我们这里使用的是 iife，rollup 会将代码包裹在一个自执行函数中，便于在浏览器中执行；rollup 还支持 cjs（针对 Node.js）、umd（针对 Node.js 和浏览器）等输出格式
- --name 定义输出的包的名字，这里是 foo
- --file 定义打包出的文件的名字，这里是 bundle.js

### 使用配置文件

如果想使用更加复杂的配置，或者不想每次都在命令行中输入各种参数，我们可以使用配置文件，rollup 使用 --config 参数来定义要使用的配置文件。比如，我们创建一个名为 rollup.config.js 的文件来描述上面示例中的命令行参数，从而达到同样的效果：

```javascript
// rollup.config.js
export default {
  input: 'main.js',
  output: {
    format: 'iife',
    name: 'foo',
    file: 'bundle.js'
  }
}
```

然后开始打包，最终效果和上面的示例一样：

```bash
rollup --config rollup.config.js
```

可以看到 rollup 的配置文件也是一个 js 文件，该文件需要导出 rollup 需要的各项配置。

### 使用插件

rollup 只提供打包的核心功能，如果你还想使用 babel 编译代码、压缩代码等功能，可以使用 rollup 社区提供的丰富插件，参考 [Awesome Rollup](https://github.com/rollup/awesome)。接下来我们就使用 rollup 的压缩插件 [rollup-plugin-uglify](https://github.com/TrySound/rollup-plugin-uglify) 来压缩代码。

首先我们使用 npm 安装 rollup-plugin-uglify，在命令行执行：

```bash
npm i --save-dev rollup-plugin-uglify
```

然后将 rollup.config.js 修改为下面的样子：

```javascript
// rollup.config.js
import { uglify } from 'rollup-plugin-uglify'
export default {
  input: 'main.js',
  output: {
    format: 'iife',
    name: 'foo',
    file: 'bundle.js'
  },
  plugins: [ uglify() ]
}
```

最后开始打包：

```bash
rollup --config rollup.config.js
```

可以看到，这次打包输出的 bundle.js 已经是被压缩过的了。rollup 的插件使用 plugins 字段来定义，plugins 是一个数组，打包时，rollup 会使用数组中的插件来进一步处理代码。

### 总结

虽然这篇文章定位为 rollup 简介，但也几乎涵盖了 rollup 的全貌，相较于 webpack 简单得多，我们不需要理解纷繁复杂的概念，配置也简单明了，符合人的直观思维。但 webpack 肯定也有自己的优势，两者定位不同，通常来说，打包 JavaScript 工具、库，推荐使用 rollup，打包 web 应用，推荐使用 webpack。