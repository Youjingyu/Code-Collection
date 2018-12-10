### 前言

在 Ajax 出现之前，网页想要和服务器通信，最常用的方式是使用 form 表单；用户提交表单后，浏览器就开始跳转，服务器接收表单并处理，然后将新的网页返回给浏览器；整个过程用户都只有等待，用户之前的操作状态会丢失，并且服务器返回的新网页常常和之前网页的大部分内容相同，浪费带宽；可见，使用表单来进行网页和服务器的交互，会做很多无谓的工作，浪费资源，用户体验还差。

Ajax 是 Asynchronous JavaScript and XML（异步的 JavaScript 与 XML 技术）的缩写，并不是 JavaScript 的一部分，而是网页与服务器通信的一系列技术的总称。网页使用 Ajax 与服务器通信，可以规避上述 form 表单存在的问题，页面不会刷新，用户不用等待请求的返回，可以继续在我们的网页上“冲浪”。第一个大规模使用 Ajax 的网页应用是 Gmail，Gmail 的出现让大家意识到网页还能这么玩，网页也能做得像桌面应用一样，打破了大家对网页应用的认知，说 Ajax 为 web 技术注入了灵魂也不为过。

### 简单使用

浏览器为我们提供了 XMLHttpRequest 对象（低版本 IE 使用 ActiveXObject 对象），让我们能够方便地使用 Ajax。下面我们就用 Ajax 来和服务器打声招呼：

```javascript
var xhr
// 实例化一个 XMLHttpRequest 对象
if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
} else if (window.ActiveXObject) { // IE 6及以下
    xhr = new ActiveXObject("Microsoft.XMLHTTP");
}
// 监听 readystatechange 事件
xhr.onreadystatechange = function () {
  if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            console.log('请求成功')
        } else {
        }
    }
}
// 开始发起请求
xhr.open('GET', '/api/hello');
xhr.send();
```

可见，发送一个 Ajax 请求，只需几步：实例化一个 XMLHttpRequest 对象，监听 readystatechange 事件，最后使用 open、send 方法发出请求即可。

### 深入

