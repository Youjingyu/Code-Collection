## 检测页面可见性
```javascript
let doc = document

let hidden
let state
let visibilityChange
// 各种浏览器兼容
if (typeof doc.hidden !== 'undefined') {
  hidden = 'hidden'
  visibilityChange = 'visibilitychange'
  state = 'visibilityState'
} else if (typeof doc.mozHidden !== 'undefined') {
  hidden = 'mozHidden'
  visibilityChange = 'mozvisibilitychange'
  state = 'mozVisibilityState'
} else if (typeof doc.msHidden !== 'undefined') {
  hidden = 'msHidden'
  visibilityChange = 'msvisibilitychange'
  state = 'msVisibilityState'
} else if (typeof doc.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden'
  visibilityChange = 'webkitvisibilitychange'
  state = 'webkitVisibilityState'
}

doc.addEventListener(visibilityChange, function () {
  if (doc[state] === hidden) {
    // hidden
  } else {
    // visible
  }
})
```