### linux 安装 puppeteer

```bash
npm i puppeteer
# 安装相关缺少的依赖
# https://luodao.me/post/puppeteer-pakeng.html
sudo yum install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 nss.x86_64 -y

sudo yum install ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc -y

# 安装中文字体
COPY fonts/*.* /usr/share/fonts/chinese/
sudo -S chmod -R 755 /usr/share/fonts/chinese && cd /usr/share/fonts  && sudo -S  ttmkfdir -e /usr/share/X11/fonts/encodings/encodings.dir
vi /etc/fonts/fonts.conf
# https://www.jianshu.com/p/f2ba4f5b8f36
# 下载微软雅黑字体 http://www.font5.com/download.php?id=8982&designated=1231818422
# 在 xml 添加一行: <dir>/usr/local/share/fonts/chinese</dir>
# <!-- Font directory list -->
# <dir>/usr/share/fonts</dir>
# <dir>/usr/share/X11/fonts/Type1</dir>
# <dir>/usr/share/X11/fonts/TTF</dir>
# <dir>/usr/local/share/fonts</dir>
# <dir>/usr/local/share/fonts/chinese</dir>
# <dir prefix="xdg">fonts</dir>
# <!-- the following element will be removed in the future -->
# <dir>~/.fonts</dir>
```

#### docker file
```docker
FROM 685235515338.dkr.ecr.eu-west-1.amazonaws.com/tars-node:stable
RUN echo "mima" | sudo -S yum install -y install pango.x86_64 libXcomposite.x86_64 libXcursor.x86_64 libXdamage.x86_64 libXext.x86_64 libXi.x86_64 libXtst.x86_64 cups-libs.x86_64 libXScrnSaver.x86_64 libXrandr.x86_64 GConf2.x86_64 alsa-lib.x86_64 atk.x86_64 gtk3.x86_64 nss.x86_64 && yum clean all
RUN echo "mima" | sudo -S yum install -y ipa-gothic-fonts xorg-x11-fonts-100dpi xorg-x11-fonts-75dpi xorg-x11-utils xorg-x11-fonts-cyrillic xorg-x11-fonts-Type1 xorg-x11-fonts-misc && yum clean all
COPY fonts/*.* /usr/share/fonts/chinese/
RUN  echo $(ls /usr/share/fonts/chinese)
RUN echo "mima" | sudo -S chmod -R 755 /usr/share/fonts/chinese && cd /usr/share/fonts  && sudo -S  ttmkfdir -e /usr/share/X11/fonts/encodings/encodings.dir
COPY fonts.conf /etc/fonts/
RUN echo $(cat /etc/fonts/fonts.conf)
```