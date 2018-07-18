const doc = document

export default {
  set (val) {
    const input = doc.createElement('input')
    input.setAttribute('readonly', 'readonly')
    input.setAttribute('value', val)
    input.style.position = 'absolute'
    input.style.left = '-9999px'
    input.style.top = (window.pageYOffset || document.documentElement.scrollTop) + 'px'
    doc.body.appendChild(input)
    input.focus()
    input.setSelectionRange(0, input.value.length)
    if (doc.execCommand('copy')) {
      doc.execCommand('copy')
      return true
    }
    doc.body.removeChild(input)
    return false
  }
}