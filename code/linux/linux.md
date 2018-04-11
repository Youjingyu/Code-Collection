- 批量替换目录下所有文件的特定字符
```bash
// 将文件中的\t 替换为`，-P参数使grep将后续匹配符识别为正则
sed -i "s/\t /\`/g"  `grep -P '\t\ ' -rl ./dir`;
```
- 简单命令
```bash
// watch日志
tail -f logfile
// 搜索含有特定字符的行
grep match_text logfile
// 编辑crontab
crontab -e
// 重启crontab
service crond restart
// 查看文件、文件夹大小，-h 以易于人阅读的形式输出
du -h logfile
du -h logdir
// 查看系统盘使用情况
df -h
// 查看系统状态，内存占用等
top
// pm2
pm2 list
pm2 start app.js --name app
pm2 restart all
pm2 restart 1
pm2 restart app
// 查看大文件
find . -type f -size +800M
// 查看大目录
du -h --max-depth=1
// 软链接
ln -s file copyfile
// 硬链接
ln file copyfile
// 查看开机启动项
chkconfig
// 就是查看文件里有多少行
 wc -l filename
// 从服务器下载文件（rsync -r处理文件夹，客户端和服务端都需要安装rsync）
rsync username@serverIp:serverFilePath localFileName
// 上传文件到服务器
rsync localFileName username@serverIp:serverFilePath

```