### 前端静态文件加载时间埋点统计
 - 使用Date
在资源加载开始之前，执行
```javascript
    new Date().getTime() // 获取开始时间
```
在每个资源的onload事件中统计时间
````html
    <linl href="test.css" rel="stylesheet" onload="new Date().getTime()"></linl>
    <script src="test.js" onload="new Date().getTime()"></script>
    <img src="test.png" onload="new Date().getTime()">
````
最后通过各个时间节点计算每个资源的加载时间

- 使用Resource Timing API
使用```window.performance.getEntriesByType("resource")```收集页面资源加载的具体信息。
详情参考[使用Resource Timing API分析前端性能探索](http://fe.sina.cn/2016/11/04/shi-yong-resource-timing-apifen-xi-qian-duan-xing-neng-tan-suo-yi/)、
[Resource Timing (资源计时) 使用技巧](http://ju.outofmemory.cn/entry/110290)
