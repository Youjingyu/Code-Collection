#!/usr/bin/env bash
# Author:xiaojue
# 2018-02-13
# 脚本适用于centos6.5 sce环境

#设置iptables 开放端口
PORTS=80,443
BASHDIR=`pwd`

cat << EOF
+-----------------------------------------------------------------------------------------+
|     **********  Welcome to CentOS 6.5 System init for Sina SCE by xiaojue **********    |
+-----------------------------------------------------------------------------------------+
EOF

#成功提示
function success(){
    echo -e "\033[32m Success!!!\033[0m\n"
    echo "#########################################################"
}

#检查权限，运行必须是root用户
[ `whoami` != "root" ] && echo "please use root exec this file" && exit 1

#更新yum为阿里云的源
echo "set yum mirrirs with aliyun"
cd /etc/yum.repos.d/
mv CentOS-Base.repo CentOS-Base.repo.bak
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
wget -O /etc/yum.repos.d/epel.repo http://mirrors.aliyun.com/repo/epel-6.repo
yum clean all
yum makecache
success

#安装中文
echo "install pingfang ttc"
mkdir /usr/share/fonts
mkdir /usr/share/fonts/chinese
cd /usr/share/fonts/chinese
wget https://gitlab.weibo.cn/SINA_MFE/initCentos/raw/master/PingFang.ttc
chmod -R 755 PingFang.ttc
yum install mkfontscale fontconfig -y
mkfontscale
mkfontdir
fc-cache -fv
source /etc/profile
success

#自动更新服务器时间
echo "set ntptime"
ntpdate cn.pool.ntp.org
echo '*/5 * * * * /usr/sbin/ntpdate cn.pool.ntp.org &>/dev/null' >> /etc/crontab
hwclock -w
success

#设置文件句柄数
echo "Set ulimit 65535"
cat << EOF > /etc/security/limits.conf
*    soft    nofile  65535
*    hard    nofile  65535
*    soft    nproc 65535
*    hard    nproc 65535
EOF
sed -i 's/65535/1024000/g' /etc/security/limits.d/90-nproc.conf
success

#设置iptables
echo "set iptables"
iptables -F
iptables -A INPUT -p tcp -m multiport --dports $PORTS -j ACCEPT
iptables -A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -m state --state NEW,ESTABLISHED -j ACCEPT
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT
service iptables save
success

#安装系统必需软件包
echo "install system pack"
yum -y install make gcc-c++ cmake bison-devel ncurses-devel net-snmp sysstat dstat iotop lrzsz flex byacc libpcap libpcap-devel nfs-utils ntp zip unzip xz wget vim lsof bison openssh-clients htop lftp
success

#安装系统套件软件包
echo "install development tools"
yum -y groupinstall "Development Tools" "Server Platform Development"
success

#安装git命令行
echo "install git"
yum install curl-devel expat-devel gettext-devel openssl-devel zlib-devel gcc perl-ExtUtils-MakeMaker -y
yum remove git -y
cd /usr/src
wget https://www.kernel.org/pub/software/scm/git/git-2.5.0.tar.gz
tar -zxvf git-2.5.0.tar.gz
cd git-2.5.0
./configure
make prefix=/usr/local/git all
make prefix=/usr/local/git install
echo "export PATH=$PATH:/usr/local/git/bin" >> /etc/bashrc
source /etc/bashrc
success

#安装node和npm
echo "install node & npm"
yum -y install gcc make gcc-c++ openssl-devel wget
cd /usr/src
wget https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-x64.tar.xz
tar xvJf node-v8.9.4-linux-x64.tar.xz
cd node-v8.9.4-linux-x64
echo "export PATH=$PATH:/usr/src/node-v8.9.4-linux-x64/bin" >> /etc/bashrc
source /etc/bashrc
success

#安装cnpm和pm2
echo "install cnpm & pm2"
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install -g pm2
success

# 安装一堆其他的图形依赖
echo "install image deps"
yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y
yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 -y
success

# 可能需要安装字体
# https://www.jianshu.com/p/26e9892ae692
