## 动态注入js
为了提前页面的onload、DOMContentLoaded时间，从而让浏览器尽早脱离loading的状态（我们的项目中，image是通过js懒加载的），可以将js的type设置为text/async-script，在onload之后再注入js。需要注意注入方式，如果循环创建script依次append进页面，不能保证js执行顺序，如果在每个js的onload中依次append，就不能利用浏览器的并行加载。拼成script标签字符串，再innerHTML,不会执行。最终可以使用fragment插入，并保证js的执行顺序。
```javascript
window.addEventListener('load', function () {
  // 保证js按照顺序执行、并且可以并行加载，使用fragment一次性将js加入页面
  var docfrag = document.createDocumentFragment();

  [].forEach.call(document.getElementsByTagName('script'), function(scriptTag){
    if(scriptTag.getAttribute('type') === 'text/async-script'){
      var src = scriptTag.getAttribute('data-src');
      var script = document.createElement('script');
      if(src){
        script.src = src
      } else {
        // 行内js
        script.textContent = scriptTag.textContent
      }
      docfrag.appendChild(script);
    }
  });

  document.getElementsByTagName('body')[0].appendChild(docfrag);
});
```