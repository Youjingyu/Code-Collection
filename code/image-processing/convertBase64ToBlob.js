/**
 * 将base64转换为文件对象
 * （即用文件上传输入框上传文件得到的对象）
 * @param {String} base64 base64字符串
 */
function convertBase64UrlToBlob(base64){
    var base64Arr = base64.split(',');
    if(base64Arr.length > 1){
        //如果是图片base64，去掉头信息
        base64 = base64Arr[1];
    }
    // 将base64解码
    var bytes = atob(base64);
    var bytesCode = new ArrayBuffer(bytes.length);
    // 将base64转换为ascii码
    for (var i = 0; i < bytes.length; i++) {
        bytesCode[i] = bytes.charCodeAt(i);
    }
    // 转换为类型化数组
    var byteArray = new Uint8Array(bytesCode);
    // 生成Blob对象（文件对象）
    return new Blob( [byteArray] , {type : 'image/png'});
}