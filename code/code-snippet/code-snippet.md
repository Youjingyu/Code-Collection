- moment格式化带月份的时间
```javascript
moment('04/May/2018:11:39:24', 'DD/MMM/YYYY:HH:mm:ss', 'en')
// 月份的格式可以通过http://momentjs.cn/docs/#/customization/month-names 配置
```
- 自实现path.resolve
```javascript
function pathResolve (root, path) {
  path = path.replace(/^(.\/|\/)/, '')
  const pathArr = path.split('/')
  let depth = 0
  for (let i = 0; i < pathArr.length; i++) {
    if (pathArr[i] !== '..') {
      break
    }
    depth = i + 1
  }
  pathArr.splice(0, depth)
  const rootArr = root.split('/')
  rootArr.splice(rootArr.length - 1 - depth)
  return rootArr.concat(pathArr).join('/')
}
```
- 获取对象的所有属性
```javascript
function getAllPropertyNames( obj ) {
  var props = [];

  do {
      props= props.concat(Object.getOwnPropertyNames( obj ));
  } while ( obj = Object.getPrototypeOf( obj ) );

  return props;
}
```