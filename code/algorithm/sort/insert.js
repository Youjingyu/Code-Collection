// 第一个元素视为已排序数组，选出后面的第一个元素插入已排序数组
function insert (arr) {
  const len = arr.length
  let sortedArrLen = 1
  for (let i = 1; i < len; i++) {
    // 关键：insertIndex用于标记已经插入顺序数组的位置
    let insertIndex = i
    for (let j = sortedArrLen - 1; j >= 0; j--) {
      // 只要在顺序数组中找到比自己大的，就插入
      // 但不一定插入了最小的位置，所以需要继续遍历
      if (arr[j] > arr[insertIndex]) {
        const temp = arr[j]
        arr[j] = arr[insertIndex]
        arr[insertIndex] = temp
        insertIndex = j
      }
    }
    sortedArrLen++
  }
  return arr
}

// 使用二分查找找到插入位置，再插入
function insertOptimize (arr) {
  const len = arr.length
  let sortedArrLen = 1
  for (let i = 1; i < len; i++) {
    let left = 0
    let right = sortedArrLen - 1
    let itemToInsert = arr[i]
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      if (itemToInsert > arr[mid]) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
    sortedArrLen++
  }
  return arr
}

console.log(insert([9, 3, 5, 3, 7, 9, 6, 4, 6, 0, 1, 5, 32, 67, 238, 81, 12, 345, 54, 34]))