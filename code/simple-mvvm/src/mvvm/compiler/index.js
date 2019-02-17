import compileUtil from './compilerUtil'

export default class Compiler {
  constructor (vm, el) {
    this.$vm = vm
    this.$el = this.isElementNode(el) ? el : document.querySelector(el)
    // 在 fragment 中操作，提高性能
    this.$fragment = this.node2Fragment(this.$el)
    this.compileElement(this.$fragment)
    this.$el.appendChild(this.$fragment)
  }
  node2Fragment (el) {
    const fragment = document.createDocumentFragment()
    let child
    // eslint-disable-next-line
    while (child = el.firstChild) {
      fragment.appendChild(child)
    }
    return fragment
  }
  compileElement (el) {
    const childNodes = el.childNodes

    Array.from(childNodes).forEach((node) => {
      const text = node.textContent
      const reg = /\{\{(.*)\}\}/

      if (this.isElementNode(node)) {
        this.compile(node)
      } else if (this.isTextNode(node) && reg.test(text)) {
        this.compileText(node, RegExp.$1)
      }

      if (node.childNodes && node.childNodes.length) {
        this.compileElement(node)
      }
    })
  }
  compile (node) {
    const nodeAttrs = node.attributes

    Array.from(nodeAttrs).forEach((attr) => {
      const attrName = attr.name
      if (this.isDirective(attrName)) {
        const exp = attr.value
        const dir = attrName.substring(2)
        // 事件指令
        if (this.isEventDirective(dir)) {
          compileUtil.eventHandler(node, this.$vm, exp, dir)
          // 普通指令
        } else {
          compileUtil[dir] && compileUtil[dir](node, this.$vm, exp)
        }

        node.removeAttribute(attrName)
      }
    })
  }

  compileText (node, exp) {
    compileUtil.text(node, this.$vm, exp)
  }

  isDirective (attr) {
    return attr.indexOf('v-') === 0
  }

  isEventDirective (dir) {
    return dir.indexOf('on') === 0
  }
  isElementNode (node) {
    return node.nodeType === 1
  }

  isTextNode (node) {
    return node.nodeType === 3
  }
}
