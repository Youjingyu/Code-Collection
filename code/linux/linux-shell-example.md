### 检查硬盘容量，并邮件占用过大的部分
```bash
#!/bin/bash
mail=fuqiang6@staff.sina.com.cn,jingyu16@staff.sina.com.cn
num=` df |awk '{print $5}'|grep -c -E "^[7-9][0-9]|^100"`
#通过df命令查看硬盘使用情况，并通过awk只查看第五个域的内容，再通过grep只筛选以7到9开头的双位数(即50到99之间的任意数)或以100开头的行，最终把匹配的行数赋值给num。 grep的-c选项是用来计算匹配行的行数。
if [ $num -gt 0 ]    #如果num的值大于0
then
df |grep -E "[7-9][0-9]%|100%"|mail -v -s "disk warning" $mail -  #把使用率超过70%的硬盘情况通过邮件发出去。
fi
```
### 判断进程是否存在，不存在重启
```bash
#!/bin/sh
cd `dirname $0`
BIN_DIR=`pwd`
ES_ID=`ps -ef |grep elasticsearch |grep '/usr/share/elasticsearch'|grep -v 'grep'|awk '{print $2}'`
# 日志输出
ESMonitorLog=$BIN_DIR/es-master-monitor.log
NOW=`date '+%Y-%m-%d %H:%M:%S'`
Monitor()
{
  if [[ $ES_ID ]];then # 这里判断ES进程是否存在
    echo "[info][$NOW] 当前ES进程ID为:$ES_ID"
  else
    date '+%Y-%m-%d %H:%M:%S'
    echo "[error][$NOW] ES进程不存在!ES开始自动重启..."
    /etc/init.d/elasticsearch start
  fi
}
```
使用contab定时执行上述任务
```bash
*/1 * * * *  /bin/bash /path-to/checkdisk.sh
*/15 * * * * /bin/sh /path-to/es_monitor.sh
```
