import Dep from './dep'

export default class Watcher {
  constructor (vm, exp, cb) {
    this.$vm = vm
    this.$exp = exp
    this.$cb = cb
    Dep.target = this
    // 这里会触发 observer 中的 getter
    // 然后将该 watcher 加入 dep
    this.value = vm[exp]
  }
  update () {
    const oldVal = this.value
    const newVal = this.$vm[this.$exp]
    if (oldVal === newVal) return
    this.value = newVal
    this.$cb.call(this.$vm, newVal, oldVal)
  }
}
