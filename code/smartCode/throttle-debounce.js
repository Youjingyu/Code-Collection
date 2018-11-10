// 节流
function throttle (frequency, func) {
  let timer
  return function () {
    if (timer) return
    timer = setTimeout(() => {
      func.apply(this, arguments)
      timer = null
    }, frequency)
  }
}

// 防抖
function debounce (delay, func) {
  let timer
  return function () {
    clearTimeout(timer)
    timer = setTimeout(function () {
      func.apply(this, arguments)
    }, delay)
  }
}
