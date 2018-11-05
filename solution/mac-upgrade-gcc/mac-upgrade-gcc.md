## mac升级管理gcc
下载[port](https://www.macports.org/install.php)
```bash
# 添加环境变量
vi ~/.bash_profile
# 然后写入
export PATH=/opt/local/bin:/opt/local/sbin:$PATH
# source一下
source ~/.bash_profile
# 查找gcc库
port search gcc
sudo port install gcc6
port select --list gcc
sudo port select --set gcc mp-gcc6
# 清空bash缓存
hash -r
```