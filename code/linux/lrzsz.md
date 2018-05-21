## lrzsz
在mac item2中使用linux上传下载工具lrzsz  
mac安装：```brew install lrzsz```  
centos安装：```sudo yum -y install lrzsz```  
将https://github.com/mmastrac/iterm2-zmodem下的两个sh文件复制到mac的/usr/local/bin，然后添加执行权限：
```bash
chmod +x /usr/local/bin/iterm2-send-zmodem.sh 
chmod +x /usr/local/bin/iterm2-recv-zmodem.sh
```
配置item2：打开iTerm2 -> Preferences -> Profiles 选择 Advanced 设置 Triggers ，点击 Edit，添加两项：
```bash
Regular expression: \*\*B0100
Action: Run Silent Coprocess
Parameters: /usr/local/bin/iterm2-send-zmodem.sh

Regular expression: \*\*B00000000000000
Action: Run Silent Coprocess
Parameters: /usr/local/bin/iterm2-recv-zmodem.sh
```
如图：  
![item2](https://user-images.githubusercontent.com/15033260/40297193-8d83be8c-5d11-11e8-9282-2aca8542fcae.png)  
重启item2，在服务器的命令行中输入rz，就可以选择本地文件上传了。