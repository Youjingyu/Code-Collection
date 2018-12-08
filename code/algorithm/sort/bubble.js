// 1. 依次比较相邻的两个数，如果不符合排序规则，则调换两个数的位置。这样一遍比较下来，能够保证最大（或最小）的数排在最后一位。
// 2. 再对最后一位以外的数组，重复前面的过程，直至全部排序完成。
// 时间复杂度：平均o(n^2) 最差o(n^2) 最好o(n)
// 空间复杂度：o(1)
function bubble (arr) {
  const len = arr.length
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      const temp = arr[j]
      if (temp > arr[j + 1]) {
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}
// n -1 + n - 2 + n - 3 + ... + n - (n - 1) = n^2 + n*(n - 1)/2

// 优化：记住最后一次交换的位置pos，下次交换到pos截止
function bubbleOptimize1 (arr) {
  const len = arr.length
  let pos = len - 1
  for (let i = 0; i < len; i++) {
    // 这里需要保存pos，不直接用pos作为j循环的边界
    // 因为pos在当前循环中会改变
    let stop = pos
    for (let j = 0; j < stop; j++) {
      const temp = arr[j]
      if (temp > arr[j + 1]) {
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
        pos = j
      }
    }
  }
  return arr
}

// 优化：
console.log(bubbleOptimize1([9, 3, 5, 3, 7, 9, 6, 4, 6, 0, 1, 5, 32, 67, 238, 81, 12, 345, 54, 34]))
