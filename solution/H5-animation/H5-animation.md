### 高效H5动画及性能优化

- 动画实现方案
    - GIF。最多256种颜色，只支持全透明、不支持半透明，动画质量与资源体积成正比
    - Animated PNG。支持度低。
    - Video。使用autoplay、loop实现。视频不能太长，也不能太短导致一直循环播放
    - SVG。无失真，复杂动画、复杂位图效果难以呈现
    - Canvas、WebGL。
    - JS。requestAnimationFrame
    - CSS3。transition、keyframe。渲染引擎会做优化。
- 屏幕适配
    - 页面主体，在不同屏幕下只缩放（rem、scale）
    - 边缘元素（按钮），绝对定位
- 工具
    - 性能检测，stats.js
    - tinypng
    - 图片合并（可预览动画）：https://tonytony.club/tool/dongdong/p
    - textureMerger
- 性能优化
    - 避免重绘、重排
    - 使用scale替代width、height
    - 使用translate(x, y)替代margin
    - 元素创建后，立即设置translateZ(0)或translate3D(0,0,0)
    - 使用css3会创建单独的layer层
    - 性能：canvas>js+css(background)>css(translate)>css(background)
    - 使用css的will-change让浏览器预优化
    - 懒加载、猜测用户动作预加载
大的雪碧图会导致GPU压力大，导致掉帧
    - http 2.0
    - 弃用雪碧图：使用zip，前端使用jszip解压出ArrayBuffer，再转base64。再使用CDN缓存、IndexDB
css3动画控制
    - settimeout等待动画完成，误差大
    - animationStart-animationEnd，兼容性不好
    - 降级使用JS
FPS控制
    - settimeout/setinterval
    - requestAnimationFrame，它会尽量保持与浏览器的刷新频率一致，但也可以使用DOMHighResTimeStamp控制帧率
- 500px的图画到250的canvas上会模糊
    - 先绘制到500px的canvas再scale缩小
```javascript
   var context = canvas.getContext('2d');
   context.scale(radio, radio)
```    
- 性能评分
    - 创建200个div，宽高100，然后做随机transform、opacity，计算动画时间
    
    
    