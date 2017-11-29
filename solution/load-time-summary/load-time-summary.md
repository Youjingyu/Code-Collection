### 前端静态文件加载时间埋点统计

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
