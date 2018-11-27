## rsyslog简单使用（v8.x）

推送端
```bash
# /etc/rsyslog.conf

# 加载文件处理模块
module(load="imfile")
# 定义出入
input(type="imfile"
    # 输入文件的路径
    File="/var/log/performance-log/*.log.*"
    Facility="user"
    Severity="error"
    Tag="web_access"
    PersistStateInterval="1"
    # 使用的规则
    Ruleset="ruleset1")
# 定义输出规则
ruleset(name="ruleset1"){
  # 将日志推送到10.88.132.120:10515
  action(type="omfwd" Protocol="tcp" Target="12.88.132.120" Port="10515") stop
}
```

接收端（12.88.132.120）
```bash
# /etc/rsyslog.conf

# 加载tcp模块
module(load="imtcp")
# 加载json parse模块
module(load="mmjsonparse")
# 加载elasticsearch模块
module(load="omelasticsearch")
# 加载kafka模块
module(load="omkafka")

# 定义template
# 推送的elasticsearch的template
template(name="es-tpl" type="list"){
    constant(value="{\"@timestamp\":\"") property(name="timereported" dateFormat="rfc3339")
    constant(value="\",") property(name="$!all-json" position.from="2")
}
# 推送的kafka的template
template(name="kafka-tpl" type="string" string="%msg%")
# 定义输入
# 从10515端口接收
input(type="imtcp" Port="10515" Ruleset="ruleset1")
# 定义输出规则
ruleset(name="performance") {
    # 推送到kafka
    action(type="omkafka"
    topic=""
    broker="12.88.132.120:9110,12.88.132.121:9110"
    confParam=["sasl.mechanisms=PLAIN","security.protocol=sasl_plaintext","sasl.username=","sasl.password=","api.version.request=true"]
    Template="kafka-tpl"
    partitions.auto="on"
    errorFile="/var/log/kafka/kafka-err.log")
    # 解析为json后推送到elasticsearch
    action(type="mmjsonparse")
    action(type="omfile" DynaFile="performanceDynFile")
    action(type="omelasticsearch"
        template="es-tpl"
        searchIndex="your_index"
        dynSearchIndex="on"
        bulkmode="on"
        searchType="logs"
        queue.type="LinkedList"
        queue.size="1000"
        queue.dequeuebatchsize="300"
        action.resumeretrycount="-1"
        server="12.88.132.119"
        serverport="62320") stop
}
```

验证rsyslog配置是否正确：
```bash
rsyslogd -N 1
```
在debug模式下运行
```bash
rsyslogd -dn
```