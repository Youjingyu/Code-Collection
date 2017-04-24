/**
 * 压缩图片
 * @author Youjingyu 2017-4-17
 * @param {Dom Object} $fileInput 文件上传输入框
 * @param {Number} b
 * @return {Number} sum
 */
function compressImg($fileInput, options) {
    options = options || {};
    // 绑定change事件
    $fileInput.onchange = function ($event) {
        var $target = $event.target;
        if ($target.files && $target.files[0]) {
            // 用FileReader读取文件
            var reader = new FileReader();
            reader.readAsDataURL($fileInput.files[0]);
            reader.onload = function(evt){
                var base64 = evt.target.result;
                // 创建图片对象
                var img = new Image();
                img.src = base64;
                img.onload = function () {
                    var that = this,
                        canvas = document.createElement('canvas'),
                        ctx = canvas.getContext('2d');
                    canvas.setAttribute('width', that.width);
                    canvas.setAttribute('height', that.height);
                    ctx.drawImage(that, 0, 0, that.width, that.height);

                    var scale = 0.9;
                    // 大于1M才压缩
                    while (base64.length / 1024 / 1024 > 1) {
                        base64 = canvas.toDataURL('image/jpeg', scale);
                        // 降低压缩比率，直到压缩结果小于1M
                        scale = scale - 0.1;
                    }
                }
            }
        }
    }
}
