import Dep from './dep'

export default function observer (data) {
  Object.keys(data).forEach((key) => {
    let val = data[key]
    if (Object.prototype.toString.call(val) === '[object Object]') {
      observer(val)
    } else {
      const dep = new Dep()
      Object.defineProperty(data, key, {
        get () {
          Dep.target && dep.addSub(Dep.target)
          Dep.target = null
          return val
        },
        set (newVal) {
          if (val === newVal) return
          val = newVal
          dep.notify()
        }
      })
    }
  })
}
