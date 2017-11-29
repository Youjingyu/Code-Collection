/**
 * 上传之前预览图片
 * @param {Dom Object} $fileInput 文件上传输入框
 * @param {Dom Object} $previewImg 预览图片的image元素
 */
function previewImg($fileInput, $previewImg) {
    $fileInput.onchange = function ($event) {
        var $target = $event.target;
        if ($target.files && $target.files[0]) {
            var reader = new FileReader();
            reader.readAsDataURL($target.files[0]);
            reader.onload = function(evt){
                var base64 = evt.target.result;
                $previewImg.setAttribute('src', base64);
            }
        }
    }
}