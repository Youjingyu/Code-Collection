## 基于npm的系统命令开发
使npm全局安装包后，添加系统命令
#### package.json添加bin字段
```json
{
  "cmd-name": "./bin/index.js"
}
```
添加后，全局安装该包时，npm会将命令```cmd-name```加入系统命令
#### 获取命令行参数
命令行执行```cmd-name parama1 parama2```相当于执行```node ./bin/index.js parama1 parama2```  
在```./bin/index.js```中获取命令行参数
```javascript
#!/usr/bin/env node

console.log(process.argv) // ["node", "./bin/index.js", “ parama1”， “parama2”]
```
#### 输出带颜色的log
```javascript
// 输出黄色log
console.log('\x1b[33m', log, '\x1b[0m')
```
```\x1b[0m```代表清除前面设置的格式，不清除的话，后面的所有输出都会变色  
颜色列表：  
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"