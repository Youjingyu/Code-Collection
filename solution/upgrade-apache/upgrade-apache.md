### mac下编译升级Apache

编译httpd需要依赖apr、apr-util

安装apr
```bash
# http://apr.apache.org/download.cgi
wget http://mirror.bit.edu.cn/apache//apr/apr-1.6.5.tar.gz
tar -zxvf apr-1.6.5.tar.gz
cd apr-1.6.5
./configure --prefix=/usr/local/apr
make -j4
make -j4 install
```

安装apr-util
```bash
# http://apr.apache.org/download.cgi
wget http://mirror.bit.edu.cn/apache//apr/apr-util-1.6.1.tar.gz
tar -zxvf apr-util-1.6.1.tar.gz
cd apr-util-1.6.1
./configure --prefix=/usr/local/apr-util --with-apr=/usr/local/apr
make -j4
make -j4 install
```

安装httpd
```bash
# http://httpd.apache.org/download.cgi
wget http://mirrors.hust.edu.cn/apache//httpd/httpd-2.4.37.tar.gz
tar -zxvf httpd-2.4.37.tar.gz
cd httpd-2.4.37
./configure --with-apr=/usr/local/apr --with-apr-util=/usr/local/apr-util
make -j4
make -j4 install
```