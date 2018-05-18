## mac下命令行自动设置代理
由于shadowsSocks会覆盖系统的代理，关闭shadowsSocks后，代理不会切换回来，所以希望命令行自动切换  
```bash
# 新建 .proxy_alia 文件
vi .proxy_alia
# 写入
echo '电脑密码'|sudo  networksetup -setautoproxyurl 网络名 代理地址
# 比如
echo '电脑密码'|sudo  networksetup -setautoproxyurl Wi-Fi http://10.210.97.118/proxy.pac
# source一下
source .proxy_alia
# 然后在命令行执行 proxy 就可以切换系统代理了
# 另外 networksetup 还可以单独设置http、https代理，具体使用networksetup -help查看  
# 也可以加入shell编程来实现更复杂的控制
```