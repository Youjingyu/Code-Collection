// 快排必须要用到递归，采用分而治之的思路
// 选择一个基准值（通常选最中间的值，一定概率上可以降低复杂度）
// 声明两个数组 less、greater，比基准值大的放入 greater，小的放入 less
// 递归地再对 less、greater 进行相同的操作，并把结果 concat 起来得到最终结果
// 其实每次递归，都需要 n 次操作，但是总递归次数，取决于基准值的选择
// 比如对于已排序的数组，选择 arr[0] 做基准值
// 那每次递归，只有一个元素放到 less，剩余的元素都放到 greater
// 也就是最终的递归次数是 n，时间复杂度为 O(n^2)
// 如果选择 arr[Math.floor(arr.length / 2)] 作为基准值，
// 那 less、greater 每次都分别能放入一半的次数
// 也就总递归次数为 2 为底的对数，时间复杂度是 n*O(log n)

// 时间复杂度：平均n*O(log n) 最差O(n^2) 最好n*O(log n)
// 空间复杂度 O(log n)
function quickSort (arr) {
  if (arr.length < 2) return arr
  const pivot = arr[Math.floor(arr.length / 2)]
  const less = []
  const greater = []
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] <= pivot) less.push(arr[i])
    if (arr[i] > pivot) greater.push(arr[i])
  }
  return [].concat(quickSort(less), pivot, quickSort(greater))
}

console.log(quickSort([2, 9, 0, 40, 50, 29, 12, 15, 10]))
