### 微博端文件下载

- 后端设置header
```javascript
header('Content-type: image/jpeg'); 
header("Content-Disposition: attachment; filename='download.jpg'"); 
```
- a标签的download属性，download的值为下载后的文件名
```html
    <a href="http://n.sinaimg.cn/default/08a1a488/20160519/2016-04-06_215936.pdf" download="2016-04-06_223411.pdf">下载</a>
```