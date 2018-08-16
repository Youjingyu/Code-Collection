## 检测用户离开页面
```javascript
const win = window
let isLeaving = false
// 监听 beforeunload 比 unload 要保险一些
win.addEventListener('beforeunload', () => {
  onLeave('beforeunload')
})
// 在ios下，只有刷新才会触发unload、beforeunload，关闭页面、点击连接跳转均不会触发
// ios中貌似已经弃用unload和onload事件
// 参考[Safari Web Content Guide](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW5)
// 官方推荐使用pagehide事件（ios下点击连接跳转、关闭页面时触发，其他平台beforeunload先于pagehide触发）
win.addEventListener('pagehide', () => {
  onLeave('pagehide')
})
win.addEventListener('pageshow', (e) => {
  // ios下后退，js代码不会重新执行，后台时，需要将isLeaving置为false
  // e.persisted === true代表有缓存，说明是后退
  if (e.persisted === true) {
    isLeaving = false
  }
})
function () {
  if (isLeaving) return
  // do something when leave
}
```