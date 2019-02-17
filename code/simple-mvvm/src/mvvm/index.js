import Compiler from './compiler/index'
import observer from './observer'

export default class Mvvm {
  constructor (options) {
    this.$options = options
    const data = this._data = options.data
    Object.keys(data).forEach((key) => {
      this._proxy(key)
    })
    observer(data)
    this.$compiler = new Compiler(this, options.el)
  }
  _proxy (key) {
    const self = this
    Object.defineProperty(self, key, {
      configurable: false,
      enumerable: true,
      get () {
        return self._data[key]
      },
      set (newVal) {
        self._data[key] = newVal
      }
    })
  }
}
