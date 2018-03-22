// 由于浏览器跨域的限制，只能转同域下的图片，或者服务器设置图片的header：Access-Control-Allow-Origin: *
// 基于ajax的方式会使图片体积增大30%左右，基于canvas的会增大2到3倍
function basedOnAjax(url, cb) {
  const xhr = new XMLHttpRequest(), fileReader = new FileReader();
  xhr.open("GET", url);
  // responseType设置为blob的兼容性没有arraybuffer好
  // 可以先设置为arraybuffer，再手动转blob
  xhr.responseType = "blob";
  xhr.addEventListener("load", ()=>{
    if (xhr.status === 200) {
      fileReader.onload = (evt)=>{
        var result = evt.target.result;
        cb && cb(result);
      };
      // 转为字符串
      fileReader.readAsDataURL(xhr.response);
    }
  });
  xhr.send();
}
function basedOnAjaxArrayBuffer(url, cb) {
  const xhr = new XMLHttpRequest(), fileReader = new FileReader();
  let blobBuilder = new (window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder || window.OBlobBuilder || window.msBlobBuilder);
  let blob;
  xhr.open("GET", url);
  xhr.responseType = "arraybuffer";
  xhr.addEventListener("load", ()=>{
    if (xhr.status === 200) {
      // 将响应数据放入blobBuilder中
      blobBuilder.append(xhr.response);
      const resType = xhr.getResponseHeader('content-type');
      // 用文件类型创建blob对象
      blob = blobBuilder.getBlob(resType);
      // 转为字符串
      fileReader.readAsDataURL(blob);
      fileReader.onload = (evt)=>{
        var result = evt.target.result;
        cb && cb(result);
      };
    }
  });
  xhr.send();
}

function basedOnCanvas(url, cb) {
  const img = new Image();
  img.src = url;
  img.onload = function () {
    const imgCanvas = document.createElement("canvas"),
      imgContext = imgCanvas.getContext("2d");
    // 确保canvas尺寸和图片一致
    imgCanvas.width = img.width;
    imgCanvas.height = img.height;
    // 在canvas中绘制图片
    imgContext.drawImage(img, 0, 0, img.width, img.height);
    // 将图片保存为Data URI
    // 这里可以设置图片的清晰度，减小base64体积
    cb && cb(imgCanvas.toDataURL("image/png"));
  }
}