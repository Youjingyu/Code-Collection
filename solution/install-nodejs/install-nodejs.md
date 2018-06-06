### 通过官方的方式
有可能因为网络问题，没有下载成功，导致安装的是0.10版本
```bash
curl --silent --location https://rpm.nodesource.com/setup_8.x | sudo bash -
sudo yum -y install nodejs
```
### 压缩包安装1
```bash
cd /usr/src
wget https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-x64.tar.xz
tar xvJf node-v8.9.4-linux-x64.tar.xz
cd node-v8.9.4-linux-x64
echo "export PATH=$PATH:/usr/src/node-v8.9.4-linux-x64/bin" >> /etc/bashrc
source /etc/bashrc
```
### 压缩包安装2
```bash
cd /usr/src
wget https://nodejs.org/dist/latest-v9.x/node-v9.4.0-linux-x64.tar.xz
tar -xvJf node-v9.4.0-linux-x64.tar.xz
mv node-v9.4.0-linux-x64 /usr/local/node-v9
ln -s /usr/local/node-v9/bin/node /bin/node
ln -s /usr/local/node-v9/bin/npm /bin/npm
echo 'export PATH=/usr/local/node-v9/bin:$PATH' >> /etc/profile
source /etc/profile
```