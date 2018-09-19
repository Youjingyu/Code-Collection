### 使用node-kafka链接kafka服务器 
node-kafka编译安装过程遇到的问题参考：https://github.com/Youjingyu/problem-summary
```javascript
const Kafka = require('node-rdkafka');
// topicid、groupid、bootstrap.servers需要向kafka服务方确定
let consumer = new Kafka.KafkaConsumer(
  {
    'client.id': 'push_monitor',
    'group.id': '',//groupid
    'enable.auto.offset.store': true,
    'offset.store.method': 'none',
    'session.timeout.ms': 30000,
    'fetch.min.bytes': 1024,
    // 订阅服务器
    'bootstrap.servers': '10.39.14.43:9110,10.39.14.47:9110,10.39.14.25:9110,10.39.14.27:9110,10.39.14.31:9110',
    'security.protocol': 'sasl_plaintext',
    'sasl.mechanisms': 'PLAIN',
    'sasl.username': '', // 账户
    'sasl.password': '', // 密码
    'api.version.request': true
  },
  {
    'auto.offset.reset': 'latest',
    'enable.auto.commit': true,
    'auto.commit.interval.ms': 3000
  }
)
consumer.on('ready', () => {
  consumer.subscribe(['']) //topicid
  consumer.consume()
}).on('data', msg => {
  
})
consumer.connect();

```
