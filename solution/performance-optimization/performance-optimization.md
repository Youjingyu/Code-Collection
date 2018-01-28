## 前端性能优化
性能优化目标主要是让用户尽快看到页面内容、页面能够尽快对用户操作做出反馈。  
所以主要关注下面几个指标
- First Paint 白屏时间：浏览器从白屏到第一次视觉变化。
- First Meaningful Paint 首次有效渲染：文字、图像和主要内容都已可见。
- Visually Complete 视觉完整：视口中的所有内容都可见。
- Time to Interactive 可交互时间：视口中的所有内容都可见，并且可以进行交互（JavaScript 主线程停止活动）。
### 资源优化
- 主动缓存
- 启用压
- 使用 CDN
- 优先关键资源
     - 浏览器有默认的关键请求（如果请求包含用户视口渲染所需的资源，那该请求就是关键请求。）， 比如HTML、必要的 CSS、LOGO、网络字体，也可能是图片。但许多其他不相关的（JavaScript、追踪代码、广告等）也可能被请求。
     - 通过<link rel ='preload'>，我们可以手动强制设置资源的优先级，来确保所期望的内容按时渲染。
     - chrome控制台可以查看浏览器默认的请求优先级。
### 图片优化
- 选择正确的格式。
    - JPEG：色彩丰富的图片（例如照片）。PNG–8：色彩不是很丰富的图片。PNG–24：具有部分透明度的图片。GIF：动画图片
- 尽可能使用矢量图
- 如果变化不明显，则降低质量
- 尝试新格式，Google 的 WebP，Apple 的 JPEG 2000 和 Microsoft 的 JPEG-XR
    - WebP，74%浏览器支持，并有降级方案
- 使用工具和算法进行优化
- 使用 srcset 属性和 picture 元素，85%+ 的浏览器支持率
- 使用图片 CDN
### 优化网络字体
- 选择正确的格式
- 字体选择评测
- 使用 Unicode-range 子集
- 建立字体加载策略
### 优化 JavaScript
低端机器解析执行JavaScript的时间可能是高端机器的2-5倍
- 监控 JavaScript 传输
- 移除不必要的依赖
- 实施代码分割
- 考虑框架选择

#### 参考链接
- https://mp.weixin.qq.com/s/g1hNWleW00ACQ5u1oU2_cQ
- https://github.com/xitu/gold-miner/blob/master/TODO/front-end-performance-checklist-2018-1.md
- https://www.smashingmagazine.com/2018/01/front-end-performance-checklist-2018-pdf-pages/
