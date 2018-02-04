## 基于贝叶斯推断的用户唯一性识别
对于弱登陆web应用（如新闻、博客、品牌电商官网等），要做个性化推送、广告推送，其前提是能够唯一性的识别不同的用户，常规识别用户的做法是基于cookie、本地存储，但在移动端，这些信息经常丢失，导致用户识别错误率偏高。  
在本地信息丢失的情况下，可以使用ip（内网、外网）、fp（根据用户设备信息计算出的hash，参考文末的备注）识别用户，但识别成功率仍不理想。但我们可以使用贝叶斯推断来提高正确率。  
对于贝叶斯推断本身，可以参考阮一峰的系列文章：  
- [贝叶斯推断及其互联网应用（一）：定理简介](http://www.ruanyifeng.com/blog/2011/08/bayesian_inference_part_one.html)
- [贝叶斯推断及其互联网应用（二）：过滤垃圾邮件](http://www.ruanyifeng.com/blog/2011/08/bayesian_inference_part_two.html)
- [贝叶斯推断及其互联网应用（三）：拼写检查](http://www.ruanyifeng.com/blog/2012/10/spelling_corrector.html)

可以简单地理解贝叶斯推断为，我们先预估一个"先验概率"，然后加入实验结果，看这个实验到底是增强还是削弱了"先验概率"，由此得到更接近事实的"后验概率"。如果该实验结果不断加入，就会到导致后验概率越来越大。也就是说，事件B发生时，事件A也发生的次数越多，我们就越有信心认为事件B发生时，事件A会发生。B发生时，A发生的概率记做P(A|B)，则有:
```bash
P(A|B) = P(B|A)*P(A)/P(B)
```
对应到我们这里的场景，假设用户张三来访问我们的页面，页面会上报他的ip和fp，该ip-fp组合出现即为事件B；一段时间后，该ip-fp组合再次出现时，对应的用户恰好是张三即为事件A。对于同样的ip-fp组合，在cookie没有丢失的情况下，我们可以知道该组合对应的用户是张三还是李四。如果更多时候是对应的张三，并且多到了一定程度，在cookie丢失时，如果再次发现该ip-fp组合，我们就有信心认为该用户就是张三。这个‘程度’用概率来衡量，即某ip-fp组合出现时，恰好是某用户的概率。如果我们为每个来访用户分配随机的vid（随机hash，会存入cookie），在cookie丢失时，对于某一ip-fp组合，恰好是某一用户的概率P(vid|ip-fp)为：
```bash
P(vid|ip-fp) = P(ip-fp|vid)*P(vid)/P(ip-fp)
```
当一个没有cookie的用户来访问我们的页面，页面上报ip-fp，后台可以根据数据库得到该ip-fp出现的概率P(ip-fp)；由于该ip-fp组合可能对应张三、李四或更多用户，我们可以计算每个用户出现的概率P(vid)；由于用户的ip、fp都可能变化，在该用户出现时，其对应的ip-fp组合恰好是此时的ip-fp组合的概率P(ip-fp|vid)也可以计算。最后，便可以计算出每个可能用户的P(vid|ip-fp)，概率最大者，比如张三的概率最大，我们就可以认为来访用户就是概率最大的用户。为了提高识别的准确度，我们还需要为P(vid|ip-fp)定一个阈值，比如0.3，即概率最大的用户的概率大于0.3，我们才有信心认为来访用户就是概率最大的用户，否则就按新用户处理，分配新的vid。  
为了验证上述处理方式的正确率并确定阈值，可能还是需要依赖强登陆的产品。因为用户登陆了，因此可以验证我们找出的可能性最大的用户是不是正确的，从而可以得到一个正确率，可以用唯一性和稳定性来衡量。假设注册用户具有唯一标示uid，唯一性、稳定性计算方式如下：  
![唯一性、稳定性计算](https://github.com/Youjingyu/Code-Collection/blob/master/solution/bayesian/img/compute.png)  
通过取不同的阈值，可以得到不同的稳定性、唯一性，从而得到最合适的阈值。从上述的过程可以看出，数据库越大，识别得越准确，因此数据变多时，可以适当提高阈值。  
在找到合适的阈值后，完全可以推广到同类产品，因为这个算法本质上是规避cookie丢失的问题，不受产品本身影响。

备注:   
fp信息组成如下：  
![设备信息](https://github.com/Youjingyu/Code-Collection/blob/master/solution/bayesian/img/deviceinfo.png)  
evercookie  
![evercookie成功率](https://github.com/Youjingyu/Code-Collection/blob/master/solution/bayesian/img/evercookie.png)