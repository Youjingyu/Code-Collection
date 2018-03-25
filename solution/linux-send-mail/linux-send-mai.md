### Linux定时邮件发送
基于nodejs、nodemailer、sendmail   
#### node js
```javascript
const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    sendmail:true,
    newline:'unix',
    path:'/usr/sbin/sendmail'
});
transporter.sendMail({
  to: 'xxxx@xx.com',
  subject: 'Message',
  text: 'mac has been there'
}, (err, info) => {
  console.log(info.envelope);
  console.log(info.messageId);
});
```
#### linux
```bash
yum -y install sendmail
service sendmail start
```
查看sendmail服务状态，如果出现sendmail dead but subsys locked，说明postfix和sendmail冲突了
```bash
postfix stop
```
测试邮件
```bash
echo "this is my test mail" | mail -s 'mail test' xxx@yyy.com
# 或
mail -s 'mail test' xxx@yyy.com < con.txt
```
查看邮件日志
```bash
tail -f /var/log/maillog
```
等一会，如果出现超时，可能是25端口没有打开
```
iptables -A INPUT -p tcp --dport 25 -j ACCEPT
```
对于腾讯云服务器，还需要到云控制台手动打开25端口的解禁,腾讯的协议要求只能使用smtp发送邮件，因此不能再sendemail
```javascript
let transporter = nodemailer.createTransport({
    host: 'smtp.qq.com',
    secure: true,
    auth: {
        user: 'xxx@qq.com',
        pass: '***'
    }
});
transporter.sendMail({
  from: 'xxx@qq.com',
  to: 'xxx@qq.com',
  subject: 'Message',
  text: 'mac has been there'
}, (err, info) => {
  console.log(info.envelope);
  console.log(info.messageId);
});
```