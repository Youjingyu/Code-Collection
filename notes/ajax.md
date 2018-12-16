### 前言

在 Ajax 出现之前，网页想要和服务器通信，最常用的方式是使用 form 表单；用户提交表单后，浏览器就开始跳转，服务器接收表单并处理，然后将新的网页返回给浏览器；整个过程用户都只有等待，用户之前的操作状态会丢失，并且服务器返回的新网页常常和之前网页的大部分内容相同，浪费带宽；可见，使用表单来进行网页和服务器的交互，会做很多无谓的工作，浪费资源，用户体验还差。

Ajax 是 Asynchronous JavaScript and XML（异步的 JavaScript 与 XML 技术）的缩写，并不是 JavaScript 的一部分，而是网页与服务器通信的一系列技术的总称。网页使用 Ajax 与服务器通信，可以规避上述 form 表单存在的问题，页面不会刷新，用户不用等待请求的返回，可以继续在我们的网页上“冲浪”。第一个大规模使用 Ajax 的网页应用是 Gmail，Gmail 的出现让大家意识到网页还能这么玩，网页也能做得像桌面应用一样，打破了大家对网页应用的认知，可以说 Ajax 为 web 技术注入了灵魂。

### 使用

浏览器为我们提供了 XMLHttpRequest 对象（低版本 IE 使用 ActiveXObject 对象），让我们能够方便地使用 Ajax。下面我们就用 Ajax 来和服务器打声招呼：

```javascript
var xhr
// 实例化一个 XMLHttpRequest 对象
if (window.XMLHttpRequest) {
  xhr = new XMLHttpRequest();
} else if (window.ActiveXObject) { // IE 6及以下
  xhr = new ActiveXObject("Microsoft.XMLHTTP");
}
// 绑定 xhr.readyState 改变时调用的回调
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
    if (xhr.status === 200) {
      console.log(xhr.responseText)
      console.log('请求成功')
    } else {
      console.log('请求错误')
    }
  }
}
// 初始化请求
xhr.open('GET', '/api/hello');
// 设置请求头（可选）
xhr.setRequestHeader('Accept', '*/*')
// 发出请求
xhr.send();
```

可见，发送一个最简单的 Ajax 请求，只需几步：实例化一个 XMLHttpRequest 对象，绑定 readyState 改变时调用的回调，最后使用 open、send 方法发出请求即可。

上面的代码涉及到 XMLHttpRequest 对象的常用属性、方法，接下来依次解释它们的作用。

注：为了方便阅读，下面用 xhr 指代 XMLHttpRequest

`xhr.onreadystatechange`

请求发出后，只要 xhr.readyState 发生变化，就会调用通过 xhr.onreadystatechange 绑定的函数。

`xhr.readyState`

xhr.readyState 的值代表 xhr 对象所处的状态，可能的状态如下：

| 值 | 状态 | 描述 |
|----------|----------|----------|
| 0 | UNSENT | xhr已被创建，但还没有调用 open 方法 |
| 1 | OPENED | open 方法被调用 |
| 2 | HEADERS_RECEIVED | send 方法被调用，并且可以获取响应头部以及响应状态码 |
| 3 | LOADING | 正在下载响应内容 |
| 4 | DONE | 下载完成 |

就像上面的示例一样，一般我们在 xhr.onreadystatechange 绑定的函数中判断 xhr.readyState 的值，当值变为4的时候，我们再做进一步处理。

`xhr.status`

xhr.status 代表服务器响应的 http 状态码，比如上面的示例中，我们认为 xhr.status 等于200的时候，服务器正常返回了我们想要的内容，否则认为请求发生错误。

`xhr.responseText`

xhr.responseText 的值即为服务器响应的内容。

`xhr.open(method, url, async, user, password)`

xhr.open方法，用于初始化请求，可以接受5个参数，后三个参数都是可选的，通常我们也很少使用

- method：要使用的HTTP方法，比如 GET、POST、PUT、DELETE 等
- url：请求的url
- async（可选）：是否发起异步请求，默认值为 true；注意，新版本的浏览器已经不建议将该值设置为 false 来发起同步请求
- user（可选）：用户名，用于认证
- password（可选）：用户密码，用于认证

`xhr.setRequestHeader(header, value)`

xhr.setRequestHeader 用于设置 http 请求的 header。需要注意的是，该方法只能在调用 xhr.open 初始化请求后，并且在调用 xhr.send 发出请求之前调用，否则会抛出错误。该方法接收两个参数

- header: 设置的 header 头的名字
- value：设置的 header 头的值

`xhr.send(content)`

xhr.send 方法用于发出请求。注意，如果发出的是同步请求，该方法会阻塞 js 的执行。xhr.send 接收一个参数

- content：请求发送的内容。如果是 GET 或 HEAD 请求，应当不传这个参数或者传null

### XMLHttpRequest Level 2

在 HTML5 之前，虽然各家浏览器都实现了 XMLHttpRequest 接口，但由于没有统一的规范，导致各个浏览器的实现或多或少有些差异。HTML5 将 XMLHttpRequest 纳入了规范，并在原来的基础上做了升级，提出了 XMLHttpRequest Level 2。

XMLHttpRequest Level 2 相较于老版本的 XMLHttpRequest 主要新增了如下内容：

- 可以设置HTTP请求的超时时间
- 可以通过 FormData 发送表单数据
- 可以上传文件
- 支持跨域请求
- 可以获取服务器端的二进制数据
- 可以获得数据传输的进度信息

#### 设置HTTP请求的超时时间

`xhr.timeout`

和 xhr.setRequestHeader 一样，xhr.timeout的值只能在调用 xhr.open 之后且在 xhr.send 之前设置

```javascript
var xhr = new XMLHttpRequest()
xhr.open('GET', '/api/hello')
xhr.timeout = 2000 // 超时时间，单位是毫秒
xhr.ontimeout = function (e) {
  // XMLHttpRequest 超时，在此做超时的处理
}
xhr.send(null)
```

#### 发送表单数据

HTML5 新增了一个 FormData 对象，用于模拟表单。我们可以结合 FormData 与 xhr 发送表单数据

```javascript
var xhr = new XMLHttpRequest()
// 实例化一个 FormData 对象
var formData = new FormData()
// 向 FormData 添加数据
formData.append('username', 'whale')
formData.append('age', '18')
xhr.open('POST', '/api/form')
// 发送表单数据
xhr.send(formData)
```

#### 上传文件

FormData 除了可以添加字符串数据，也可以添加 [blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)、[file](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects) 类型的数据，因此可以用于上传文件。在浏览器中，一般是通过文件上传输入框来获取 file 对象，比如：

```html
<input type="file" name='uploadFile' id="upload-file" />
```

然后监听 input 的 change 事件，获取 file 对象：

```javascript
document.getElementById('upload-file').addEventListener('change', function () {
  formData.append('uploadFile', this.files[0])
  xhr.send(formData)
})
```

#### 跨域请求

默认情况下，浏览器出于安全考虑不允许发送[跨域请求](https://www.zhihu.com/question/26376773)，但有时候向不同域的服务器发送请求是必要的。为了标准化跨域请求流程，W3C 提出了[跨域资源共享](http://www.ruanyifeng.com/blog/2016/04/cors.html)（Cross-origin resource sharing，简称 CORS）标准，在 CORS 出现之前，通常是使用 [JSONP](https://baike.baidu.com/item/JSONP) 来取巧地解决跨域问题，但由于 JSONP 存在各种限制，因此在支持 CORS 的浏览器中（IE10 以下不支持）还是推荐使用 CORS。

要使用 CORS，默认情况下，前端不用修改任何代码，如果浏览器发现 XMLHttpRequest 发出了跨域请求，会帮我们做相应的处理，但服务器需要返回 `Access-Control-Allow-Origin` 响应头，指定允许进行跨域请求的域。

CORS 请求默认是不发送 Cookie 的，如果想要发送 cookie，服务器需要返回 `Access-Control-Allow-Credentials: true`，并且前端需要设置 withCredentials 属性：

```JavaScript
xhr.withCredentials = true
```

#### 接收二进制数据

XMLHttpRequest level 1 只能接收文本数据，新版本 XMLHttpRequest 添加了接收二进制数据的能力。要接收二进制数据，一般有两种方式。

一种是使用 `overrideMimeType` 方法覆写服务器指定的 [MIME 类型](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types)，从而改变浏览器解析数据的方式。

`xhr.overrideMimeType(mimeType)`

- mimeType：要设置的 MIME 类型

比如：

```javascript
// 告诉浏览器，服务器响应的内容是用户自定义的字符集
xhr.overrideMimeType('text/plain; charset=x-user-defined')
```

执行上面的代码后，浏览器就会将服务器返回的二进制数据当成文本处理，我们需要做进一步的转换才能拿到真实的数据：

```javascript
// 获取二进制数据的第 i 位的值
var byte = xhr.responseText.charCodeAt(i) & 0xff
```

针对 "& 0xff" 运算，参考[阮一峰的文章](http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html)解释如下：

> "& 0xff" 运算，表示在每个字符的两个字节之中，只保留后一个字节，将前一个字节扔掉。原因是浏览器解读字符的时候，会把字符自动解读成Unicode的0xF700-0xF7ff区段。

在较新的浏览器中，可以采用另一种接收二进制数据的方式。

xhr.responseType 用于设置服务器返回的数据的类型。我们可以将返回类型设置为 [blob](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 或者 [arraybuffer](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer)，然后就可以从 xhr.response 属性获取到对应类型的服务器返回数据。比如：

```javascript
xhr.responseType = 'arraybuffer'
xhr.onload = function () {
  var arrayBuffer = oReq.response
  // 接下来对 arrayBuffer 做进一步处理...
}
```

#### 数据传输进度信息

新版本的 XMLHttpRequest 允许我们监听数据传输的详细状态，上面的示例代码，我们就使用 onload 监听了一个数据传输完成的事件。可以监听的事件如下：

| 事件 | 描述 |
|----------|----------|
| onloadstart | 获取数据开始 |
| onprogress | 数据传输过程中 |
| onabort | 数据获取被取消 |
| onerror | 获取数据错误 |
| onload | 获取数据成功 |
| ontimeout | 获取数据超时 |
| onloadend | 获取完成（无论成功或失败）|

### 总结

上面我们总结了 XMLHttpRequest 的大部分内容，可见XMLHttpRequest 已经非常强大了，通过它我们可以和服务器做复杂的交互，从而为我们开发出功能强大的 web 应用创造了条件。XMLHttpRequest 的 api 并不多，也不复杂，感兴趣的同学可以查看 [MDN XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest) 文档，了解更多内容。

### 参考资料

- [MDN XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
- [XMLHttpRequest Level 2 使用指南](http://www.ruanyifeng.com/blog/2012/09/xmlhttprequest_level_2.html)
- [Sending and Receiving Binary Data](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data)