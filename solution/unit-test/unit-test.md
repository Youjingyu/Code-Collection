特殊的单元测试方式

下面的测试方式都依赖 (sinon)[https://sinonjs.org/releases/v7.3.0/]  
下面的测试都在 mocha 环境下

### process.exit 的回调测试

如果想测试程序在 process 的 exit 事件中的行为符合预期，比如下面的代码，我们需要手动触发 exit 事件，但又不想导致测试进程退出：

```javascript
const doSomeThing = () => {}
process.on('exit', doSomeThing)
```

1. 通过 process.kill

```javascript
const sinon = require('sinon')

describe('process exit', () => {
  let stubExit
  before(() => {
    // 劫持 process.exit 方法，避免进程真正退出
    stubExit = sinon.stub(process , 'exit')
  })
  after(() => {
    // 还原 process.exit
    stubExit.restore()
  })
  it('should call exit callback', () => {
    // 向进程发送关机信号 SIGTERM，从而会触发 process 的 exit 事件
    // 不能使用 SIGINT 信号，因为 mocha 监听这个信号判断进程退出
    process.kill(process.pid, 'SIGTERM')
  })
})
```

2. process.listeners

```javascript
describe('process exit', () => {
  it('should call exit callback', () => {
    // 直接执行 exit 事件的回调函数
    process.listeners('exit')[0](0)
  })
})
```

通过上述 process.kill 的方式不能触发 uncaughtException 事件的回调，但可以通过这里的方式：

```javascript
describe('process uncaughtException', () => {
  it('should call uncaughtException callback', () => {
    // 直接执行 uncaughtException 事件的回调函数
    process.listeners('uncaughtException')[0](new Error('mockError'))
  })
})
```

### 测试函数调用次数

sinon 有丰富的 api，这里只是简单地示例使用：

```javascript
const sinon = require('sinon')
const assert = require('assert)

describe('some test', () => {
  it('should call logger with string error level', () => {
    const stubLogger = sinon.stub(logger, 'info').callsFake(() => {
      console.log(arguments) // 'msg', { level: 'error' }
    })
    stubLogger('msg', { level: 'error' })
    // 执行了一次
    assert(stubLogger.callCount === 1)
    console.log(stubLogger.getCall(0).args) // 'msg', { level: 'error' }
  })
})
```