/**
 * 获取深层数据结构中的数据
 * @param {Array} keyArr 查找数据所需key组成的数组
 * @param {Object} dataObject 数据对象
 */
function getDeepObjectData(keyArr, dataObject) {
    return keyArr.reduce(function (data, key) {
        return (data && data[key]) ? data[key] : null
    }, dataObject)
}

// 使用示例
var testData = {
    a: {
        b: {
            c:{
              d: 2,
              h: 5
            },
            j: 4
        },
        f:{
            g: 1
        }
    },
    r: {
        l:{
            o: 2
        }
    }
}

// 通常做法
testData['a'] &&
testData['a']['b'] &&
testData['a']['b']['c'] &&
testData['a']['b']['c']['h']

// 使用上述函数
getDeepObjectData(['a', 'b', 'c', 'h'], testData) // 5