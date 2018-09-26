# weird problem
平时遇到的古怪问题的总结

- 功能键在非Firefox浏览器不触发keypress事件的问题
	- 比如，按下backspace键在Firefox下会触发keydown、keypress事件，而在chrome下只会触发keydown事件
	- 参考[键盘事件keydown、keypress、keyup随笔整理总结](http://www.cnblogs.com/xcsn/p/3413074.html)
	- 可以使用DOM 3级的KeyboardEvent来模拟keypress事件，但有部分兼容性问题，参考[KeyboardEvent](https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent)
- 如果canvas中绘制了跨域图片，canvas.toDataURL会报错，可以用img.setAttribute('cross0rigin', 'Anonymous')解决，但前提是服务器允许跨域请求图片
- 呼出键盘后，页面元素被遮挡，可以设置页面高度为document.getClientHeight来解决
- 在ios下，呼出键盘后，页面元素的位置会调整，但绝对定位元素中的输入框的焦点却还在原来的位置。可以在呼出键盘后，手动使绝对定位元素中的input获得一次焦点来解决（focus方法）
- ios下，不会执行keyup事件回调函数中的异步请求
- 安卓下用vh设置高度，呼出键盘时内容会被压缩，同样的，可以设置页面的高度为document.getClientHeight来解决
- 在vue-cli的webpack模板中使用postcss，无论如何配置，display:flex的前缀都添加不对，导致在ios8下显示异常，但单独使用postcss处理工程中的css或者在postcss的网页工具中处理，却能正确添加前缀。猜测是因为vue 2.3之后会自动为display:flex这样的属性添加前缀，但根据文档，vue只是针对v-bind:style添加到元素上的样式做处理，详见多[重值](https://cn.vuejs.org/v2/guide/class-and-style.html#多重值)<br>
这里暂时强行解决，在webpack打包完成后，再用postcss为打包后的css添加前缀。在vue-cli工程中的处理为，在build/build.js中，在webpack打包完成的回调函数中添加如下代码：
  ```javascript
        var fs = require("fs");
        var postcss = require('postcss');
        var autoprefixer = require('autoprefixer');
        var zlib = require('zlib');
        // dist中的css路径
        var path = './dist/static/css';
        // 读取css文件夹中的文件
        fs.readdir(path, function (err, files) {
          // 第一个文件即为输出的css
            var result_file = path + '/' + files[0];
            // 读取css
            fs.readFile(result_file, function (err, data) {
              // 添加前缀
                postcss([autoprefixer({ browsers: ['Last 20 versions'] })])
                    .process(data.toString()).then(result => {
                      // 输出添加前缀后的css
                    fs.writeFile(result_file, result.css);
                    // gzip压缩css
                    zlib.gzip(result.css, (error, gzip)=>{
                        fs.writeFile(result_file + '.gz', gzip, ()=>{
                            console.log(chalk.cyan('  autoprefix css complete.\n'))
                            console.log(chalk.cyan('  gzip css complete.\n'))
                            console.log(chalk.cyan('  Build complete.\n'))
                            console.log(chalk.yellow(
                                '  Tip: built files are meant to be served over an HTTP server.\n' +
                                '  Opening index.html over file:// won\'t work.\n'
                            ))
                        });
                    });
                });
            });
        });
  ```
- ios下上传图片，本地预览是正确显示的，上传到服务器后，页面再把图片请求回来显示，可能因为图片orientation值的不同导致图片是倒置的。解决代码[将图片旋转到正确的角度](https://github.com/Youjingyu/Code-Collection/blob/master/image-processing/resetImgOrientation.js)
- outline不能单独设置某一边，可以用css3的box-shadow模拟，也可以用下面代码hack：
```css
    .element:before {
           content: "\a0";
           display: block;
           padding: 2px 0;
           line-height: 1px;
           border-top: 1px dashed #000;
         }
```
- 只有a、button、input类标签才有blur、focus时间，希望其他元素有这两个事件，需要在元素上添加tabindex（有兼容性问题），其值在0到32767之间，数字代表被tab键遍历到的顺序，0代表不会被表遍历到。
- 输入框opacity为0时，ie仍然可以可见光标，设置输入框的color: transparent，无效，设置text-indent: -999em，能够达到效果。
- chrome和firefox支持outline: #ccc auto 1px 的写法，但在ie和微信浏览器下无效，必须制定外边框线类型，如outline: #ccc solid 1px
- for in 会遍历原型链，Object.keys()与for in的区别是不会遍历原型链，两者都不可遍历不可枚举属性；Object.getOwnPropertyNames可以获取对象自身的可枚举和不可枚举属性。
- video不能播放以链接返回的视频，如https://v.qq.com/iframe/player.html?vid=p0553hnmh8g&tiny=0&auto=0，可以使用flash播放，或者嵌入iframe：
```html
<iframe frameborder="0" width="640" height="498" src="https://v.qq.com/iframe/player.html?vid=p0553hnmh8g&tiny=0&auto=0" allowfullscreen></iframe>></iframe>
```
- 可以使用如下方式实现垂直居中：
```css
    .parent{
        position: relative;
    }
    .child{
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
    }
```
- element ui的Select组件，手动设置值时，数组类型必须和option的value的数据类型一致，否则会显示为设置的值而不是值对应的label
- 使用display: table; display: table-cell;vertical-align: bottom;可以实现某个子元素高度增加，但所有子元素仍然基线对齐。
- 使用rem和border-radius: 50%实现圆形，在小分辨率下会变成椭圆。可以在小分辨率下使用固定像素解决。
- 移动端webview很多都有导航栏（如微信和qq），设计整屏页面时，需要扣除导航高度（如qq内置浏览器，顶部占用150px，底部占用260px，750\*1334的设计稿最终为750*1074）；一种设计是，页面主体内容不要太高，剩余部分用纯色填充，或者用绝对定位元素填充，实现自适应。
- 二维码要用img引入，背景图长按不能识别为二维码。
- qq中设置分享链接预览信息，参考文档[手机QQ接口文档：setShareInfo](http://open.mobile.qq.com/api/mqq/index#api:setShareInfo)：
    ```html
    <title>QQ中链接的标题由此处获取</title>
    <meta name="description" content="QQ中链接的描述由此处获取">
    <!-- QQ默认获取的图片有可能出现缩放问题，效果不佳，可以通过如下方法进行设置 -->
    <meta itemprop="image" content="http://*.*.com/static/images/share.png" />
    ```
    如果预览中没有正确显示预览图片，尝试将页面链接从somedomain/ 或者 somedomain/index，修改为 somedomain/index.html。
- 微信中需要保证视区内只有一个二维码，否则只能识别出第一个二维码。
- 微信中，使用meta缩放页面后，不能识别二维码:
    ```html
    <!--同一张二维码图片-->
    <!--下面这张 opacity 为 0，隐藏起来，但是实际存在，并且宽为 100%，屏幕有多大就多大-->
    < img style="right:0; top:0; height: auto;width: 100%;opacity: 0;position: absolute;" src="二维码图片地址">
    <!--下面这张是呈现给用户看的-->
    < img src="二维码图片地址" title="qrcode" alt="qrcode">
    <!--PS: img 标签前面的空格记得去掉，这里加上空格是因为简书有 bug，针对 img 标签代码渲染会出错-->
    ```
- 使用meta标签缩放页面
    ```javascript
    <!-- 以下代码默认设计稿尺寸为 640 x 1134 -->
    <meta id="viewport" content="width=device-width, user-scalable=yes,initial-scale=1" name="viewport" />
    <script>
        var detectBrowser = function(name) {
            if(navigator.userAgent.toLowerCase().indexOf(name) > -1) {
                return true;
            } else {
                return false;
            }
        };
        var width = parseInt(window.screen.width);
        var scale = width/640;  // 根据设计稿尺寸进行相应修改：640=>?
        var userScalable = 'no';
        if(detectBrowser("qq/")) userScalable = 'yes';
        document.getElementById('viewport').setAttribute(
                'content', 'target-densitydpi=device-dpi,width=640,user-scalable='+userScalable+',initial-scale=' + scale); // 这里也别忘了改：640=>?
    </script>
    ```
- vue+vux的项目中，如果使用了未定义的事件方法会报错
```TypeError: Cannot read property '_withTask' of undefined```
让人非常迷茫，代码如下：
```vue
<template>
    <div class="report-content">
        <div class="ger-loading" v-show="isError" @click="REPORT_REGET">加载失败，点击重试</div>
    </div>
</template>
<script type="text/javascript">
  import vuex from 'vuex';
  const mapActions = vuex.mapActions;
  export default {
    methods:{
      ...mapActions([
        'RENDER_CHARTS'
      ])
    }
  }
</script>
```
- es6中，如果用如下方式使用class，可能会报错```Class constructor Config$1 cannot be invoked without 'new'```
```javascript
import superReport from './superReport'
let Report = ( supperclass ) => class extends supperclass {
  constructor( options ) {
    super(options)
  }
}
new (Report(superReport))();
```
如果superReport来自node_modules，会报错，否则不会报错。
这是由es6 class的运行机制导致，可以修改babel的配置为```"presets": [ "es2015-node5" ]```解决
参考https://github.com/babel/babel/issues/4269
- vmware安装centos，选择配置系统iso后，开机依然system not found：在设置 -> CD/DVD -> 开启启动时连接。
- vmware安装centos过程中，f12为确定并到下一屏，相当于next
- 为了在虚拟机与主机间复制粘贴，需要安装vmware tools，安装方法http://blog.csdn.net/programmer_sir/article/details/46626409
- 虚拟机中centos不能联网
```bash
 vi  /etc/sysconfig/network-scripts/ifcfg-eth0
 ONBOOT=yes // 开机启动网卡
 MM_CONTROLLED=no
```
- centos安装最新版git
```bash
yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel // git依赖库
yum install gcc perl-ExtUtils-MakeMaker // 编译gcc

yum remove git

cd /usr/local/webserver
wget https://www.kernel.org/pub/software/scm/git/git-2.7.2.tar.gz
tar xzf git-2.7.2.tar.gz

cd git-2.7.2
make prefix=/usr/local/git all
make prefix=/usr/local/git install
// 添加环境变量
echo "export PATH=$PATH:/usr/local/git/bin" >> /etc/profile
source /etc/profile
```
- centos编译安装node-rdkafka报错
```bash
unrecognized command line option -std=c++11
# 升级gcc即可：https://www.quyu.net/info/628.html
# 升级过程中继续报错
// make[1]: *** [all-stage1-gcc] Error 2
// make[1]: *** [stage1-bubble] Error 2
# 首先保证有10G硬盘、1G内存、1G Swap分区，swap分许可以开启临时的http://smilejay.com/2012/09/new-or-add-swap/
# 如果需要swap分区持久生效，需要配置swap分区的开机启动/dev/sdb2 swap swap defaults 0 0
# 保证上述要求仍然报相同的错，可以尝试安装yum install gcc-c++ 、libgcc.i686等
# 如果报错 gmp.h can't be found, or is unusable
yum install gmp-devel
# mpc.h: No such file or directory
yum install libmpc-dev
# 升级成功后，可能依然会报错unrecognized command line option -std=c++11
# 可能是g++没有升级或者编译时调用的是低版本的g++
# 我这里是/usr/bin/g++ -v 版本为4.4.7，而/usr/local/bin/g++ -v 版本为6.3.0
# 显然是编译时调用了/usr/bin/g++
# 将老的g++版本移动到/usr/bin/g++4.4.7
mv /usr/bin/g++ /usr/bin/g++4.4.7
# 建立新版本g++在/usr/bin目录下的软链
ln -s /usr/local/bin/g++ /usr/bin/g++
# 同时gcc、cc, c++可能也有这个情况，解决方法相同
# 参考http://blog.csdn.net/u012973744/article/details/36197937
```
调用node-rdkafka时继续报错
```bash
libstdc++.so.6 version glibcxx_3.4.21' not found
// 因为升级gcc时，生成的动态库没有替换老版本gcc的动态库。
// 重建默认库的软连接即可：https://itbilu.com/linux/management/NymXRUieg.html
// 注意修改libstdc++.so.6.0.21版本，该文章中的是libstdc++.so.6.0.21，所有用到的地方都要修改为find / -name "libstdc++.so*"命令输出的版本
```
- 针对上面的centos node-kafka报错，最简单的解决方式是一键升级GCC：
```bash
sudo yum install centos-release-scl
sudo yum install devtoolset-7-gcc*
scl enable devtoolset-7 bash
which gcc
source /opt/rh/devtoolset-7/enable 
gcc --version
```
- mac编译安装node-kafka时报错
```bash
ld: symbol(s) not found for architecture x86_64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
```
安装时添加命令行参数解决
```bash
CPPFLAGS=-I/usr/local/opt/openssl/include LDFLAGS=-L/usr/local/opt/openssl/lib npm install
# 参考 https://github.com/Blizzard/node-rdkafka/issues/373
```
- nodejs使用exec执行系统命令，参数中的双引号会被去掉
```javascript
exec('elasticdump data={"test": "www"}');
```
在命令行中执行的实际为
```bash
elasticdump data={test: www}
```
解决方式
```javascript
// windows
exec('elasticdump data={"test": "www"}'.replace(/"/g, '\\"'));
// linux
exec('elasticdump data=\'{"test": "www"}\'');

// 如果在某环境中依然报错，使用shelljs执行shelljs.exec
```
- 页面onload事件触发时机较晚，甚至不触发
对于有延迟加载资源的页面、或者页面内容较多（如大量图片）、或者页面是长列表型，导致浏览器一直在加载资源，从而阻塞onload事件；如果，用户在页面加载过程中，将浏览器后台运行，这时浏览器可能会挂起，也不会触发onload事件。从而，放到onload回调里的数据收集函数不被触发。而且，经观察，onload在新浪网这种图片多、列表长的页面来说，onload不触发的概率比较大。
可以使用settimeout兜底来解决，比如3s后直接执行onload回调函数，不再等待onload。
- npm adduser，用户名、密码正确，仍旧提示错误。可能是使用了非官方npm源（如淘宝的源），需要切换回官方源：
```bash
// 查看当前源
npm config ls
// 切换回官方源
npm config set registry https://registry.npmjs.org/
```
- git clone报错
```bash
fatal: unable to access 'https://github.com/houshanren/hangzhou_house_knowledge.git/': SSL connect error
```
升级ssl版本解决
```bash
yum update -y nss curl libcurl
```
- 用fiddler抓包，手机证书无法安装
IOS：设置 —> 通用 —> 关于本机 —> 受信任证书存储区，找到需要安装的证书，安装即可。
ANDROID：设置 —> 安全 —> 从手机存储安装，找到需要安装的证书，安装即可。
- cnpm link只能link用cnpm install的工程，如果工程师yarn安装的，用cnpm link 报错：
```bash
npm WARN checkPermissions Missing write access to
```
- cnpm link的时候回安装工程，不要先安装再link，安装后会导致link文件过多，报错Maximum call stack size exceeded
- windows下修改问价权限
http://blog.csdn.net/taochangchang/article/details/12856041
- 使用service start kibana，报错chown: invalid user: `kibana:kibana'
```bash
adduser kibana
chown -R kibana:kibana /opt/kibana/optimize
service kibana start
```
- gitignore修改后不生效
```bash
git rm --cached filename
# 或者
git rm -r --cached directory
```
删除后commit删除操作就行了
- elasticsearch aggregation查询报错：
Scripts of type [inline], operation [aggs] and lang [groovy] are disabled
因为没有在/etc/elasticsearch/elasticsearch.yml中配置
script.inline: true
script.indexed: true
如果配置了还报错，可能是节点集群中的子机器没有配置
配置子节点后，重启，需要注意，子节点重启后母节点也要重启才能连接到子节点
- webpack编译软连接的文件报错：找不到模块
```javascript
resolve: {
    symlinks: false
  }
```
ln -s执行软连接时，需要在源文件的目录执行该命令，不然在目标目录cd找不到文件夹。如果仍报错：Too many levels of symbolic links，源文件和目标文件都需要使用绝对路径。
- vscode会优先使用本地安装的eslint，如果使用的本地eslint，eslint只会在本地node_modules里查找eslint-plugin，全局安装的eslint-plugin不起作用
- 在linux下按照下面方式安装nodejs，安装的确是0.10版本，：
```bash
curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
sudo yum -y install nodejs
```
怀疑是由于网路问题，curl并没有下载成功，从而可以转为而二进制文件安装：
到https://nodejs.org/zh-cn/download/ 选择linux下的二进制文件下载链接，比如我选择的linux-x64：
```bash
wget https://nodejs.org/dist/v8.11.2/node-v8.11.2-linux-x64.tar.xz
```
解压：
```bash
sudo mkdir /usr/local/lib/nodejs
sudo tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs
sudo mv /usr/local/lib/nodejs/node-$VERSION-$DISTRO /usr/local/lib/nodejs/node-$VERSION
```
配置环境变量```vi /etc/profile```：
```bash
# Nodejs
export NODEJS_HOME=/usr/local/lib/nodejs/node-$VERSION/bin
export PATH=$NODEJS_HOME:$PATH
```
刷新profile：```source /etc/profile```
验证是否安装成功：
```bash
node -v
npm -v
```
- 小程序中文本标签中换行，会一并渲染到视图中，如下面的写法，会渲染出两个换行：
```html
<text>
    测试文本
</text>
```
- JSON.stringify的问题
```JavaScript
// js对象序列化存入数据库，再请求回来可能parse失败
// 比如
JSON.stringify({'id("_test")': 123}) // 将结果'{"id(\"_test\")":123}'存入数据库
// parse失败
JSON.parse('{"id(\"_test\")":123}') // error
```
猜测原因是JSON编码与js编码并不完全一致  
一种解决方式是，在stringify之前，将js对象key中的双引号替换为单引号：```{'id("_test")': 123}```→```{"id('_test')": 123}```  
另种是在parse之前替换双引号为单引号:
```JavaScript
jsonString = jsonString.replace(/({|,)("(.*?)"\:)/ig,function($1,$2,$3,$4){return $2 + '"' + $4.replace(/"/g,"'") + '":'})
```
- 在ajax、onload等回调中，document.execCommand('copy')方法不会生效。该方法只对受信任的用户操作有效，比如click、mouseup等操作。参考[stackoverflow](https://stackoverflow.com/questions/31925944/execcommandcopy-does-not-work-in-ajax-xhr-callback)、[allowed-to-show-a-popup](https://www.w3.org/TR/html5/browsers.html#allowed-to-show-a-popup)
- 腾讯云主机，nginx配置了https后，https依然不能访问，实际没有监听443端口。貌似是，腾讯云主机貌似禁止了，以自建的ssl证书启动https服务器。从腾讯云申请免费的证书后，启动成功。
- 微信小程序
  - 如果使用ts开发小程序，会有一些古怪问题。比如在页面json中出现```useComponents```字段，会导致页面的生命周期函数不执行
  - 使用自定义组件递归实现树结构时，会报错VM13421:2 Error: Expect FLOW_MINIPULATE_CHILD but get another，但在手机上预览却能正常显示
  - 由于小程序没有computed，父组件传递的数据，需要在子组件进一步处理时，需要借助Object.defineProperty定义setter监听父组件数据的变化，但是不能监听数据类型的数据，否则js代码会中断执行，并且没有报错提示。一种间接的处理方式是，新建一个整型数据，跟随数组一起变化，监听该数据间接监听数据变化。
  - 递归组件触发事件，只能一级一级往外传，并且要在该递归组件中监听该事件，才能往外传
  - 小程序长文本用view组件在ios上会卡顿，需要用scroll-view
- service elasticsearch start报错：  
# Exception in thread "main" ElasticsearchException[Failed to load logging configuration]
多半是权限问题，解决： 
```bash
sudo chown -R elasticsearch:elasticsearch /var/lib/elasticsearch
sudo chown -R elasticsearch:elasticsearch /var/run/elasticsearch
sudo chown -R elasticsearch:elasticsearch /etc/elasticsearch
sudo chown -R elasticsearch:elasticsearch /var/log/elasticsearch
```
- swiper和mint-ui的infinite scroll插件一起视使用，swiper的slide宽度非常大的问题：
在swiper上添加width: 100%解决，貌似如果不加，会导致宽度计算错误
- swiper和mint-ui的infinite scroll插件一起视使用，无限刷新事件不触发问题：
在swiper的slide上添加overflow-y: auto，不要在infinite scroll的容器上加overflow-y: auto
- 解决canvas getImageData 跨域问题时，如果为img加上crossOrigin属性的时机，在添加src属性的时机之后，在第二次访问页面时，依然会报跨域错误。猜测是，由于src属性比crossOrigin属性先添加，第二次访问时，有缓存，src生效比较快，从而导致crossOrigin还来不及生效。因此src属性必须在crossOrigin属性之后添加。