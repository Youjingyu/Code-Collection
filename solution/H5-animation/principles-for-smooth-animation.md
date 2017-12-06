### 实现丝滑H5动画需要坚守的原则

- 除了透明度（opacity）和切换（transform），不要改变任何属性。这两个属性不会改变页面布局，并且浏览器会做优化，而修改margin、width、height会造成页面布局改变，造成浏览器渲染压力大。
- 使用opacity隐藏元素，并使用pointer-events:off禁止元素可点击。这样做不会造成回流。但因为动画的时机并不总那么完美 ，比如一个元素在不可见状态下仍然可以点击或者覆盖了其他内容，或者只有当元素淡入显示完全的时候才可以点击。下面会有解决方案。
- 不要一次开始所有动画，这很可能会造成卡顿。
    - 可以编排动画，是动画之间有部分重叠，而不是一个接一个地链式动画，可以sass/less和js实现编排
        ```sass
        @for $i from 1 through 7
          &:nth-child(#{$i})
              .loaded&
                .text
                  transition-delay: 500 + (42ms*$i)
                .bottom
                  transition-delay: 500 + (42ms*$i)
        ```
        ```javascript
        $('el').each(n, el, function() {
          setTimeout(function() {
            $(el).addClass('showing');
          }, 350 + 64*n);
        })
        ```
- 开发时，放慢动作来观察动画不流畅的地方   
- 将动画录像，在视频中观察动画不妥的地方
- 将动画效果在页面加载后延迟零点几秒将会对性能有很大的提升
- 不要直接绑定滚动事件，如实现视差滚动等特效时。
- 尽早在不同屏幕、分辨率等各类屏幕上测试，以发现实现问题、性能问题