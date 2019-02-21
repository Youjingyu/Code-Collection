## 简单的 mvvm 实现

简单的 vue mvvm 实现，用于理解 vue 原理，查看效果：

```bash
npm i
npm run dev
```

代码主要分为下面几个部分：

- Mvvm 类，即入口，执行 observer、compiler
- observe，递归数据，使用 defineProperty 收集依赖该数据的 watcher，并在状态改变时通知 watcher
- watcher，每个数据都对应一个 watcher 实例，watcher 实例会保存数据更新后要执行的回调，在回调中会更新对应的视图。一个关键的点是，observer 到数据改变后，要通知哪个 watcher 呢？watcher 实例化时，会将 Dep 类静态属性 Dep.target 修改为自己，并且会立即获取一次数据，从而会执行 observer 中的 getter，getter 中会将 Dep.target 加入自己的依赖，从而知道自己的数据改变后要通知的 watcher
- dep，一个简单的发布-订阅器，用于 watcher 和 observer 之间的沟通
- compiler，解析模板，并为模板中用到的每个数据实例化一个 watcher

除 compiler 之外的部分，都比较简单，不再赘述

#### compiler

compiler 首先将 options.el 元素中的子元素剪切到 documentFragment 中以提高 dom 操作性能。然后递归解析 fragment 中的 vue 指令。

数据绑定：解析到数据绑定时，会实例化一个 watcher，watcher 的回调是更新对应 fragment 相应数据的函数（observer 到数据变化时，就会执行 watcher 的回调，从而实现了数据到视图的自动更新）

事件绑定：直接 addEventListener 就行了，参数就是 vm.method 中的对应的函数