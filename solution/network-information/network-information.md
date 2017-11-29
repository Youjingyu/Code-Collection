### 获取手机网络状态
使用Network Information API：
```javascript
//得到网络链接类型
var type = navigator.connection.type;

// 在第一次网络跳跃的时候得到下行最大比特率
var max = navigator.connection.downlinkMax;

function changeHandler(e) {  
  // 网络链接改变时处理函数
}

// 注册网络链接改变事件
navigator.connection.onchange = changeHandler;

// 另一种注册方式
navigator.connection.addEventListener('change', changeHandler);
```
具体兼容性问题参考[Network Information API通过JS判断网络状态测试说明](http://fe.sina.cn/2017/07/27/untitled-12/)、
[Network Information API](http://wicg.github.io/netinfo/#)