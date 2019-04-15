## Node.js 框架设计

> 总结自 Node.js web 框架 [Daruk](https://github.com/daruk-framework/daruk) 的设计与开发

在开始之前，我们需要明确框架设计的目标。我们并不是想造一个底层框架，比如 koa、express 这种，一个原因是我们必须拥抱社区生态，新的轮子在生态方面可能会非常欠缺；另一方面，经过社区筛选后的成熟框架，肯定是更加合理的并且能够满足各种业务形态，新造的轮子可能会存在各种坑。因此我们这里所说的框架设计，是面向业务的，基于底层 Node.js 框架的；目标在于降低业务开发成本，约束代码风格，并提供性能分析、监控、上线部署、日志、单元测试等周边设施，最理想的情况是，业务同学只需要关注业务，其他方便面都交给框架来做。

### 业界框架

底层框架主要有：

- koa
- Express
- hapi
- restify
- fastify
- nest.js

这里所说的底层框架，肯定也是有相应的周边配套设施的，只是没有提供开箱即用的方式，也没有统一的规范，它们都可以通过简短的代码启动一个 http server。

上层框架：

- egg
- think.js
- midway
- meteor
- feathers.js

需要说明的是，上面只是对部分 Node.js 框架的简单划分，因为我并不熟悉所有框架，可能划分并不准确。

我们想要达到的目的，可能和 egg、think.js 比较接近，他们都基于约定的目录结构，有自己的开发规范，从而不同的开发人员写出来的代码都非常类似，易于维护；并且他们还提供了数据库连接、cookie、session、日志、多进程支持等特性。

### 设计思路

接下来，想一想，我们的框架要怎样设计呢？从我个人的角度来说，我比较想达到如下目标：

- 统一代码规范
- 框架概念少，易于上手，开发人员写着顺手，代码简洁
- 拥抱社区，社区工具不需要 Adapter 就能直接使用
- 提供周边工具

接下来我们一点点实现这些目标

#### 统一代码规范

对于统一代码规范，我们只需要约定目录结构，并对目录中导出的模块做一定要求就行了。对于常见的 Node.js http server，通常需要下面的目录：

```bash
├── router
│    └── index.js
├── middleware
│    └── index.js
├── controller
│    └── index.js
└── service
     └── index.js
```

router 目录用于定义路由，controller 目录用于定义路由 handle，service 目录用于抽象、复用 controller 逻辑。

除了上面的必要目录，还可以约定一些工具类目录，比如 config（项目配置）、timers（定时器）、utils（工具函数）等目录。

对于目录中的模块可以要求必须导出一个类、一个函数（用于后续自动加载约定目录中的模块）。我们会将约定目录中的模块挂载到 context 或者框架实例 app 上，比如，用户使用的时候就可以用 `ctx.service.service1` 或者 `app.service.service1`

#### 使用 typescript

typescript 在社区里越来越流行，在大型应用中，ts 对多方协作、bug 规避确实有好处，对于后端应用来说，应用的稳定性更加重要，而强类型可以在开发阶段就发现各种 bug。因此我们选择 ts 来开发，框架设计上也要向 ts 靠拢。首先是框架本身用 ts 编写，自动加载的模块不能丢失类型声明，利用上 ts 的装饰器。

##### 约定目录模块的类型声明

约定目录中的内容由框架自动加载，然后将内容挂载到 context 或者框架实例 app 上，不同于直接 `import` 约定目录中的内容，模块的挂载实际上依赖于 js 的动态性，ts 是不知道 context、app 上拥对应的属性的。因此我们需要将这些属性告知 ts，从而既能保有自动加载的便捷和严格的类型声明。为了保有类型声明，我们需要 ts 的 declare merging 特性，该特性可以将多个模块声明合并。比如我们在模块内部声明了 context，然后在用户的目录下又可以声明 context，两者会合并，从而将用户写的约定目录中的代码又挂在到 context 上：

```typescript
// 框架内部的声明
declare 'daruk' {
  Interface Context {}
}
```

```typescript
// 用户的声明文件
// 为了避免用户手动维护这些声明文件
// 我们可以提供工具自动生成这些文件
import service1 from './src/service/service1.ts'

declare 'daruk' {
  Interface Context {
    service1: service1
    // ...
  }
}
```

然后用户通过 `ctx.service.service1` 访问 `service1` 的时候就会有 `service1` 完整的类型声明。

##### 装饰器

ts 中的装饰器可以进一步对类、类属性、类方法进行修饰，我们可以利用上这一点。在上述的目录结构约定中，我们划分了 controller、router 目录，其实 router 只是一个描述信息，真正执行逻辑的是 controller，那么时候可以将两者合并呢？一个路由定义包含三个信息：路由 path + 路由的 http method + 处理路由的 handle；我们可以利用上装饰器，将这三个信息与 controller 的定义合并；首先我们用 controller 的目录结构来描述路由信息，用 http method 名作为装饰器的名字来修饰路由 handle，比如我们定义一个路径为 `/user/list` 的 get 请求路由：

```typescript
// ./controller/user/list.ts
import { get } from 'daruk'

class UserList {
  @get('/')
  index (ctx) {
    ctx.body = 'user list'
  }
}
```

当然这种是装饰器的一种用处，还有其他用处可以查看 [Daruk 装饰器](https://daruk-framework.github.io/daruk.org/decorator.html#http-method-%E8%A3%85%E9%A5%B0%E5%99%A8)

#### 链路追踪

与 php（每次请求对应一个线程并同步执行代码）、java（通过线程局部变量与某个请求绑定） 等语言搭建的 web 服务不同，Node.js 是异步编程模型，并没有顺序的调用链路，调用链是”混乱“的，因此我们的代码是不知道自己的上下文的（也就是不能对应到某个请求），当然基于 koa 的变成模型，我们在中间件和路由的 handle 中我们都能很方便地拿到上下文（即 context），但是中间件或者路由中的更深层调用呢？比如在 service 中访问 context；最简单的方式是，将 context 一层层传递下去，但是对于业务方来说，过于繁琐，难以接受。

针对上述的问题，业界也有很多解决方案，首先是官方的 async_hooks，但是直到现在的稳定版，都还有性能问题，一直处于实验性阶段；另外有一个 zone.js，zone.js 几乎覆写了所有 js 中可能存在的异步操作，然后在异步调用中传递 context；还有一种思路是通过 ast 编译，将 context 以参数的形式自动在调用链中传递；后两种思路，都太“重”了，那有没有比较轻量的方式呢？

其实我们已经约定了代码规范，只要用户按照一定方式书写代码，我们有可能在框架层面直接注入 context 的。具体来说就是，用户获取 service 和 controller 时都从 ctx 上去获取，比如 `ctx.service.service1`，`ctx.controller.controller1`，我们可以劫持 ctx、ctx.service、ctx.controller 的 getter，在 getter 中实现 ctx 的注入，从而业务方可以在各处拿到 context。伪代码如下：

```typescript
class HelpContext {
  constructor (context) {
    this._ctx = context
    Object.defineProperty(this, 'service1', {
      get () {
        // 用户定义的 service 会保存在 app.module 中
        // 每次实例化 service 都会传入对应的 ctx
        return new context.app.module['service1'](this._ctx)
      }
    })
  }
}

// 用户拿到的 context 是被框架修改后的
context.service = new HelpContext(context) 
```

### 周边工具

为了方便用户快速开始使用，以及最佳实践，我们需要为用户准备开箱即用的 cli 工具，可以参照 [daruk-cli](https://github.com/daruk-framework/daruk-cli)。当然你也可以围绕你的框架，提供一系列其它周边库，参照 [daruk 的周边库列表](https://github.com/daruk-framework)

### 单元测试

单元测试对于持续的迭代维护是必不可少的，我们可以使用 nyc 计算测试覆盖率。