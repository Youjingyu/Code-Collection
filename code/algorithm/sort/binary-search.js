// 需要循环的次数最差等于 arr.length 能够除对少次 2
// 也就是时间复杂度为 2 为底的对数，最终是 O(log n)
function binarySearch (target, arr) {
  let start = arr[0]
  let end = arr.length - 1
  while (start <= end) {
    let mid = Math.floor((start + end) / 2)
    if (target === arr[mid]) return mid
    if (target > arr[mid]) start = mid + 1
    if (target < arr[mid]) end = mid - 1
  }
  return -1
}

console.log(binarySearch(7, [ 0, 2, 9, 10, 12, 15, 29, 40, 50 ]))
