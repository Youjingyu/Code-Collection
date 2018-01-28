### 笔记

- html的空格、换行会对Gzip包大小有一定的影响。如果把页面的空格去掉，可以减小包的体积。
- ios Safari中，当使用委托给一个元素添加click事件时，如果事件是委托到 document 或 body 上，并且委托的元素是默认不可点击的（如 div, span 等），此时 click 事件会失效。解决方式：
    - ​将 click 事件直接绑定到目标​元素（​​即 .target）上
    - 将目标​元素换成 <a> 或者 button 等可点击的​元素
    - ​将 click 事件委托到​​​​​非 document 或 body 的​​父级元素上
    - 给​目标元素加一条样式规则 cursor: pointer;
- 重绘：只影响元素外观的属性改变（background等），则重新绘制元素，称为重绘
- 重排/回流：影响页面布局的元素属性（margin、width等）改变、元素增删、移动，浏览器会使受影响的部分失效，并重建这部分渲染树，完成回流后，重新绘制受影响的部分，称作重排/回流，重排过程中会重绘一次。
- 浏览器会维护一个队列，集中重排。但js去获取style信息（offsetTop、width、scrollTop等）会迫使浏览器立即重排以获取最准确的元素信息。
- Promise的catch可以理解为new Promise().then(null, rejectionFunc)的缩写
- Promise的then和catch都会返回新的Promise，所以可以链式调用。then和catch里的报错都会传到后续的catch中
- 对于Promise.all，只要数组中的一个Promise reject，Promise.all的catch就会被调用；但如果reject那个Promise已经有自己的catch了，就不会触发，因为这个catch是返回的一个新的Promise。
- Promise立即resolve过后会在本轮“事件循环”结束时执行，setTimeout(fn, 0)在下一轮“事件循环”开始时执行
```javascript
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
```
- Promise的保存不能被window.onerror捕获，而需要另外监听事件unhandledrejection
- 数组和字符串都有Iterator接口
```javascript
for(let a of [1, 2]){
    console.log(a);
}
const string = 'abchd';
for(let a of string){
    console.log(a);
}
const interator = string[Symbol.iterator]();
interator.next(); // a
interator.next(); // b
interator.next(); // c
```
- async函数会返回Promise对象，必须等到内部所有await命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到return语句或者抛出错误。只要一个await语句后面的 Promise 变为reject，那么整个async函数都会中断执行。为了不中断，有两种方式
```javascript
// 方式一
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}
f()
.then(v => console.log(v))
// hello world

// 方式二
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world
```
- 正常情况下，await命令后面是一个 Promise 对象。如果不是，会被转成一个立即resolve的 Promise 对象。
```javascript
async function f() {
  return await 123;
}
f().then(v => console.log(v))
// 123
```
- set数据结构可以用于数组的交集、并集、差集
- 正常情况下，await命令后面是一个 Promise 对象。如果不是，会被转成一个立即resolve的 Promise 对象。
```javascript
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// 差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}
```
- 日志分析、大数据处理系统ELK：elasticsearch、logstash、kibana，对应的，新浪当前使用的elasticsearch、rsyslog、grafana
- 大数据存储、查询、处理系统：kafka、spark、hadoop