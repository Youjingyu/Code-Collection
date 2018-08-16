/**
 * 将一系列字符串表示的文件路径，解析为树结构，并输出与原始顺序一致的数组
 * 数据结构见：https://api.github.com/repos/Youjingyu/Code-Collection/git/trees/eb2334713e90342e6f90f9a4288075d588845d72?recursive=1
 * @param {Array} data 原始数据
 */

function parseData (data) {
  // 将路径解析为用对象表示的树，用节点名作为key
  // 因为遍历对象不能保证顺序，因此用length、index属性模拟数组，
  // 最后使用_objToArr方法将模拟的数组转换为真数组
  const treeObj = {
    length: 0,
    index: 0
  }
  data.forEach((item) => {
    const pathArr = item.path.split('/')
    let delegateObj = treeObj
    // 遍历到到倒数第二个路径（最后一个路径单独处理）
    for (var i = 0; i < pathArr.length - 1; i++) {
      if (!delegateObj[pathArr[i]]) {
      // 如果节点不存在，为节点赋值
        delegateObj[pathArr[i]] = {
          length: 0,
          index: delegateObj.length // 当前节点在父节点中的索引
        }
        delegateObj.length++ // 添加当前节点后，父节点长度需要加1
      }
      // 保存当前节点，循环递归
      delegateObj = delegateObj[pathArr[i]]
    }
    // 对于最后一个节点，判断是否还有子节点
    // 如果有子节点，则同上赋值
    // 如果没有子节点，说明到达终点，将内容保存到该节点
    if (item.type === 'tree' && !delegateObj[pathArr[i]]) {
      delegateObj[pathArr[i]] = {
        length: 0,
        index: delegateObj.length
      }
      delegateObj.length++
    } else {
      delegateObj[pathArr[i]] = {
        index: delegateObj.length,
        item
      }
      delegateObj.length++
    }
  })
  return _objToArr(treeObj)
}

function _objToArr (obj) {
  return objToArr(obj, [])
  // 将上述模拟出的数组转换为真数组
  function objToArr (obj, arr) {
    // 删除对象中的index、length属性，避免遍历到
    // 遍历到的key即为节点名
    delete obj.index
    delete obj.length
    let nodeObj, index
    for (let key in obj) {
      // 保存节点的index，后续使用该index插入数组，达到按顺序遍历数组的目的
      index = obj[key].index
      nodeObj = {}
      // 如果是遍历到树的最底部，一对象的形式保存（因为后续会用到对象的key）
      if (obj[key].item) {
        nodeObj[key] = obj[key]
      } else {
        // 如果还没有到达树的底部，继续递归
        nodeObj[key] = objToArr(obj[key], [])
      }
      // 插入数组
      arr[index] = nodeObj
    }
    return arr
  }
}

console.log(parseData(require('./data')))
