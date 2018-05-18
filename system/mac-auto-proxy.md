## mac下命令行自动设置代理
由于shadowsSocks会覆盖系统的代理，关闭shadowsSocks后，代理不会切换回来，所以希望命令行自动切换:
```bash
sudo networksetup -setautoproxyurl 网络名 代理地址
# 比如
sudo networksetup -setautoproxyurl Wi-Fi http://10.210.97.118/proxy.pac
# 执行后，命令行会要求输入电脑密码
```
为了不每次都输入一长串命令，简化如下：  
为了在shell中输入交互式的密码，需要安装expect
```bash
brew install expect
```
然后新建```~/.set_proxy```文件，写入如下内容：
```bash
#!/bin/expect
set timeout 30
spawn sudo networksetup -setautoproxyurl Wi-Fi http://10.210.97.118/proxy.pac
expect {
    "*Password:" { send "密码\r" }
}
interact
```
在```~/.bash_profile```文件中添加：
```bash
alias proxy="expect ~/.set_proxy"
```
然后执行：
```bash
source ~/.bash_profile
```
最后就可以在命令行执行```proxy```命令来设置代理了  
另外 networksetup 还可以单独设置http、https代理，具体使用networksetup -help查看   
