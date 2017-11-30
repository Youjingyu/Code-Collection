### 笔记

- html的空格、换行会对Gzip包大小有一定的影响。如果把页面的空格去掉，可以减小包的体积。
- ios Safari中，当使用委托给一个元素添加click事件时，如果事件是委托到 document 或 body 上，并且委托的元素是默认不可点击的（如 div, span 等），此时 click 事件会失效。解决方式：
    - ​将 click 事件直接绑定到目标​元素（​​即 .target）上
    - 将目标​元素换成 <a> 或者 button 等可点击的​元素
    - ​将 click 事件委托到​​​​​非 document 或 body 的​​父级元素上
    - 给​目标元素加一条样式规则 cursor: pointer;