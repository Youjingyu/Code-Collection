llnode依赖lldb，安装lldb需要llvm
## centos安装llvm
### centos7
```bash
# Install CentOS SCLo RH Testing repository:
yum install centos-release-scl-rh
#Install llvm-toolset-7-lldb rpm package:
yum --enablerepo=centos-sclo-rh-testing install llvm-toolset-7-lldb
# https://www.jianshu.com/p/f965bbba6eb1
```
### centos6.5

#### 一键安装lldb
新建文件`/etc/yum.repos.d/llvm.repo`，写入如下内容：
```bash
[llvm]
name=LLVM for CentOS-$releasever
baseurl=https://llvm.cpp.fail/CentOS/$releasever/llvm/$basearch/
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://llvm.cpp.fail/gpg.key
```
然后`yum install lldb`即可

### 编译安装llvm
#### 升级gcc
在安装之前先[升级gcc](https://github.com/Youjingyu/Code-Collection/blob/master/solution/upgrade-gcc/upgrade-gcc.md)

#### 安装Python2.7+
```bash
sudo yum install centos-release-scl
sudo yum install python27
scl enable python27 bash
```

#### 安装cmake
```bash
sudo yum install cmake
# 如果在执行后续步骤时提示cmake版本过低，需要升级cmake
wget https://cmake.org/files/v3.5/cmake-3.5.2.tar.gz
tar xvf cmake-3.5.2.tar.gz
cd cmake-3.5.2
 ./bootstrap --prefix=/usr
 gmake
 gmake install
 cmake --version
```
### 选择llvm版本
```bash
# 列出所有版本
# llnode要求版本高于3.9
# 我选择了4.0.0
svn ls http://llvm.org/svn/llvm-project/llvm/tags | grep RELEASE
```

### 安装llvm
```bash
svn co http://llvm.org/svn/llvm-project/llvm/tags/RELEASE_400/final llvm_RELEASE_400
cd llvm_RELEASE_400/tools
svn co http://llvm.org/svn/llvm-project/cfe/tags/RELEASE_400/final clang
cd ../projects
svn co http://llvm.org/svn/llvm-project/compiler-rt/tags/RELEASE_400/final compiler-rt
svn co http://llvm.org/svn/llvm-project/libcxx/tags/RELEASE_400/final libcxx
svn co http://llvm.org/svn/llvm-project/libcxxabi/tags/RELEASE_400/final libcxxabi
cd ..
svn update

# 开始编译
mkdir ../llvm_RELEASE_360_build
cd ../llvm_RELEASE_360_build
# 注意替换gcc、g++的路径（which gcc、which g++）
# 这一步在我的1G 1核的机器上停滞在 check clang version 或 configuring done，请耐心等待
# 如果是多核心机器可以将下面的 && make && 替换为 && make -j <核心数> &&，从提高编译速度
cmake -G "Unix Makefiles" -DCMAKE_BUILD_TYPE=Release -DCMAKE_C_COMPILER=/usr/local/bin/gcc -DCMAKE_CXX_COMPILER=/usr/local/bin/g++ ../llvm_RELEASE_400 && make && sudo make install && echo success
# 查看是否安装成功
clang --version
clang++ --version
which clang
which clang++
# https://www.vultr.com/docs/how-to-install-llvm-and-clang-on-centos-6
```