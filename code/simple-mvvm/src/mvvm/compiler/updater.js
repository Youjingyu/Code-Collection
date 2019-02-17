export default {
  textUpdater (node, value) {
    node.textContent = typeof value === 'undefined' ? '' : value
  },

  htmlUpdater (node, value) {
    node.innerHTML = typeof value === 'undefined' ? '' : value
  },

  classUpdater (node, value, oldValue) {
    let className = node.className
    className = className.replace(oldValue, '').replace(/\s$/, '')

    const space = className && String(value) ? ' ' : ''

    node.className = className + space + value
  },

  modelUpdater (node, value, oldValue) {
    node.value = typeof value === 'undefined' ? '' : value
  }
}
