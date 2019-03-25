## react + typescript + css modules + scss

在 typescript 写的 react 项目中使用 css modules + scss。

首先配置 .tsx 文件的 webpack loader：

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        include: paths.appSrc,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              'presets': ['@babel/react'],
              'plugins': [
                // babel-plugin-react-css-modules 配置
                ['react-css-modules', {
                  'filetypes': {
                    '.scss': {
                      'syntax': 'postcss-scss'
                    }
                  },
                  // 默认值就是这个，一定要与 css-loader 的 localIdentName 配置一致
                  generateScopedName: '[path]___[name]__[local]___[hash:base64:5]'
                }]
              ]
            }
          },
          {
            loader: require.resolve('ts-loader'),
            options: {
              // disable type checker - we will use it in fork plugin
              transpileOnly: true
            }
          }
        ]
      }
    ]
  }
}
```

然后需要配置 tsconfig.json：

```json
// tsconfig.json
{
  "compilerOptions": {
    // 让 ts compiler 不要编译 jsx，并将文件后缀修改为 .jsx，后续交给 babel-loader 处理
    "jsx": "preserve"
  }
}
```

接下来是配置 .scss 文件的 loader：

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 1,
              modules: true,
              // 一定要与 babel-plugin-react-css-modules 的 generateScopedName 配置一致
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]'
            }
          },
          {
            loader: require.resolve('postcss-loader'),
            options: {
              // ...
            }
          },
          {
            loader: require.resolve('sass-loader'),
            options: {
            }
          }
        ]
      }
    ]
  }
}
```

另外为了让 ts 能够识别 .scss 文件，需要添加 .scss 的声明文件：

```typescript
// types/scss.d.ts
declare module "*.scss" {
  interface IClassNames {
      [className: string]: string;
  }
  const classNames: IClassNames;
  export default classNames;
}
```

然后就可以愉快地搬砖啦：

```tsx
import * as React from 'react';
// 只能有一个匿名导入
import './base.scss';
import header from './header.scss';

// 必须要进行一次赋值，否则 ts 会认为 header 未使用，从而删除 header 的导入
// @ts-ignore
const h = header

export default class Header extends React.Component {
  public render () {
    return (
      <div>
        // ./base.scss 中的 style
        <div styleName="base"></div>
        // ./header.scss 中的 style
        <div styleName="header.title"></div>
      </div>
    );
  }
}
```