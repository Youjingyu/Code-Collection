// 挑出后续最小的元素，放到最前面
// 时间复杂度：平均o(n^2) 最差o(n^2) 最好o(n^2)
// 空间复杂度：o(1)
function selectoin1 (arr) {
  const len = arr.length
  for (let i = 0; i < len; i++) {
    // 关键：记住最小元素的index，而不是值
    let minIndex = i
    for (let j = i + 1; j < len; j++) {
      if (arr[minIndex] > arr[j]) minIndex = j
    }
    if (minIndex !== i) {
      const temp = arr[i]
      arr[i] = arr[minIndex]
      arr[minIndex] = temp
    }
  }
  return arr
}
//

// 这种实现，交换次数会变多
function selectoin2 (arr) {
  const len = arr.length
  for (let i = 0; i < len; i++) {
    // 找出后面最小的
    for (let j = i + 1; j < len; j++) {
      const tempI = arr[i]
      const tempJ = arr[j]
      if (tempI > tempJ) {
        arr[i] = tempJ
        arr[j] = tempI
      }
    }
  }
  return arr
}

console.log(selectoin1([9, 3, 5, 3, 7, 9, 6, 4, 6, 0, 1, 5, 32, 67, 238, 81, 12, 345, 54, 34]))
