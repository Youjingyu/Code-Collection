### 埋点日志服务器返回 img 图片
```javascript
const gifPath = path.resolve(__dirname, './read.gif');
const gifLength = fs.statSync(gifPath).size.toString();
const gif = fs.readFileSync(gifPath); // buffer

ctx.set({
  // cache control 控制参考自 facebook.com
  // private 阻止 cdn、浏览器缓存
  'Cache-Control': 'private, no-cache, no-store, must-revalidate',
  'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT',
  'Pragma': 'no-cache',
  'Content-Type': 'image/gif',
  'Content-Length': gifLength,
});
ctx.body = gif;

```