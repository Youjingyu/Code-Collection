### 使用node-kafka链接kafka服务器
```javascript
const Kafka = require('node-rdkafka');
// topicid、groupid、bootstrap.servers需要向kafka服务方确定
let consumer = new Kafka.KafkaConsumer(
  {
    'client.id': 'push_monitor',
    'group.id': 'sina-mobile-tech_sima_miaokai_transmit_all',//groupid
    'enable.auto.offset.store': true,
    'offset.store.method': 'none',
    'session.timeout.ms': 30000,
    'fetch.min.bytes': 1024,
    // 订阅服务器
    'bootstrap.servers': '10.39.14.43:9110,10.39.14.47:9110,10.39.14.25:9110,10.39.14.27:9110,10.39.14.31:9110',
    'security.protocol': 'sasl_plaintext',
    'sasl.mechanisms': 'PLAIN',
    'sasl.username': 'sina-mobile-tech', // 账户
    'sasl.password': 'bc020561f4130f6e50583d5749ec4d8e', // 密码
    'api.version.request': true
  },
  {
    'auto.offset.reset': 'latest',
    'enable.auto.commit': true,
    'auto.commit.interval.ms': 3000
  }
)
consumer.on('ready', () => {
  consumer.subscribe(['sima_miaokai_transmit_all']) //topicid
  consumer.consume()
}).on('data', msg => {
  
})
consumer.connect();

```