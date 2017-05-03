/**
 * 压缩图片
 * （压缩后返回的是base64，可以参照本目录下的convertBase64ToBlob.js，将base64还原为file input读取得到的文件对象）
 * @param {Dom Object} $fileInput 文件上传输入框
 * @param {Function} callback 压缩完成后的回调函数
 * @return {Object} options 指定压缩到指定体积以下或按比率压缩，不指定不会压缩
 */
function compressImg($fileInput, callback, options) {
    options = options || {};
    // 绑定change事件
    $fileInput.onchange = function ($event) {
        var $target = $event.target;
        if ($target.files && $target.files[0]) {
            // 用FileReader读取文件
            var reader = new FileReader();
            // 将图片读取为base64
            reader.readAsDataURL($fileInput.files[0]);
            reader.onload = function(evt){
                var base64 = evt.target.result;
                // 创建图片对象
                var img = new Image();
                // 用图片对象加载读入的base64
                img.src = base64;
                img.onload = function () {
                    var that = this,
                        canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d');
                    canvas.setAttribute('width', that.width);
                    canvas.setAttribute('height', that.height);
                    // 将图片画入canvas
                    ctx.drawImage(that, 0, 0, that.width, that.height);
                    // 压缩到指定体积以下（M）
                    if(options.size){
                        var scale = 0.9;
                        while (base64.length / 1024 / 1024 > options.size) {
                            // 用canvas的toDataURL方法实现压缩
                            base64 = canvas.toDataURL('image/jpeg', scale);
                            // 降低压缩比率，直到压缩结果小于指定大小
                            scale = scale - 0.1;
                        }
                    } else if(options.scale){
                        // 按比率压缩
                        base64 = canvas.toDataURL('image/jpeg', options.scale);
                    }
                    callback(base64);
                }
            }
        }
    }
}
