import Watcher from '../watcher'
import updater from './updater'

// 指令处理集合
export default {
  text (node, vm, exp) {
    this.bind(node, vm, exp, 'text')
  },

  html (node, vm, exp) {
    this.bind(node, vm, exp, 'html')
  },

  model (node, vm, exp) {
    this.bind(node, vm, exp, 'model')

    let val = this._getVMVal(vm, exp)
    node.addEventListener('input', (e) => {
      const newValue = e.target.value
      if (val === newValue) {
        return
      }

      this._setVMVal(vm, exp, newValue)
      val = newValue
    })
  },

  class (node, vm, exp) {
    this.bind(node, vm, exp, 'class')
  },

  bind (node, vm, exp, dir) {
    const updaterFn = updater[dir + 'Updater']
    updaterFn && updaterFn(node, this._getVMVal(vm, exp))

    new Watcher(vm, exp, function (value, oldValue) {
      updaterFn && updaterFn(node, value, oldValue)
    })
  },

  // 事件处理
  eventHandler (node, vm, exp, dir) {
    const eventType = dir.split(':')[1]
    const fn = vm.$options.methods && vm.$options.methods[exp]

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm), false)
    }
  },

  _getVMVal (vm, exp) {
    let val = vm
    exp = exp.split('.')
    exp.forEach(function (k) {
      val = val[k]
    })
    return val
  },

  _setVMVal (vm, exp, value) {
    let val = vm
    exp = exp.split('.')
    exp.forEach(function (k, i) {
      // 非最后一个key，更新val的值
      if (i < exp.length - 1) {
        val = val[k]
      } else {
        val[k] = value
      }
    })
  }
}
