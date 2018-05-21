## 环境变量配置
系统环境变量修改```/etc/profile```，用户环境变量修改```~/.bash_profile```  
一般模板：  
```bash
# 项目目录
export JMETER_HOME=/usr/local/jmeter/apache-jmeter-3.1
export CLASSPATH=$JMETER_HOME/lib/ext/ApacheJMeter_core.jar:$JMETER_HOME/lib/jorphan.jar:$JMETER_HOME/lib/logkit-2.0.jar:$CLASSPATH
# bin目录
export PATH=$JMETER_HOME/bin:$PATH:$HOME/bin
```