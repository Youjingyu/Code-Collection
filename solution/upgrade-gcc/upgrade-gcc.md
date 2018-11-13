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
## centos升级gcc
一键升级GCC到gcc 7：
```bash
sudo yum install centos-release-scl
sudo yum install devtoolset-7-gcc*
scl enable devtoolset-7 bash
which gcc
# 得到gcc路径：/opt/rh/devtoolset-7/root/usr/bin/gcc
# source该路径上上上层目录中的/opt/rh/devtoolset-7/enable
source /opt/rh/devtoolset-7/enable 
gcc --version
```