### elasticsearch查询、存储、聚合、计数、排序
npm 有elasticsearch的包，可以用于与es服务器交互，但也可以手动调用es的result api  
我主要用到了查询和以及聚合，两者是并列关系，可以结合使用。es中字符串数据默认是会分词的，因此在保存数据之前，必须使用mapping type设置每个字段的数据类型、以及禁用分词。
- 查询  
es可以使用查询表达式，参考文档https://www.elastic.co/guide/cn/elasticsearch/guide/current/query-dsl-intro.html
```javascript
request({
    url: 'esServer/index/type/_search',
    json: true,
    body: {
      "size" : 100, // es默认只返回10条数据
      "query": {
        "bool": {
          "must": [
              {"match": {"message.log_master": 'performance'}}, // 对于嵌套数据使用.号连接
              {"match": {"message.type": 'page'}},
              ],
          "must": { "match": { "tweet": "elasticsearch" }},    
          "filter": { "range": { "age" : { "gt" : 30 }} }    
        }
      }
    }, (error, response, body)=> {
        if(!error){
            if(response.statusCode == 200){
                console.info('success');
            });
        } else {
                console.error(response.statusCode + ' error');
        }
    }
    });
```
- 聚合
```javascript
request({
    url: 'esServer/index/type/_search',
    json: true,
    body: {
      "size" : 0, // 我只需要聚合后的数据分类，不需要返回数据
      "query": {
        "bool": {
          "must": {
            "match": {
              "message.log_master": 'log_master'
            }
          }
        }
      },
      // 在查询结果的基础上聚合
      "aggs" : {
        "hosts" : { // 聚合后的分类的名字，随意设置
          "terms" : {
            "field" : "message.host" // 要聚合的数据
          }
        }
      }
    }}, function (error, response, body) {
    
  });
```
聚合还可以计算数值类型的百分位，文档https://www.elastic.co/guide/cn/elasticsearch/guide/current/percentiles.html
```javascript
request({
    url: 'esServer/index/type/_search',
    json: true,
    body: {
      "size" : 0, // 我只需要聚合后的数据分类，不需要返回数据
      "query": {
        "bool": {
          "must": {
            "match": {
              "message.log_master": 'log_master'
            }
          }
        }
      },
      "aggs" : {
        "percentile" : { // 聚合百分位
            "percentiles" : {
            "field": "message.dC", // 要计算百分位信息的数据
            "percents": ["1", "5", "25", "50", "75", "95", "99"], // 返回各个百分位段的数据值，如90%的数据在多少以下
            "script": {
                "inline": `_value - doc['message.dI'].value` // 还可以计算，这里聚合dC-dI值的百分位
            }
            }
        }
      }
    }}, function (error, response, body) {
    
  });
```
- 存储数据
```javascript
request.post({
    url: 'esServer/index/type',
    json: true,
    body: data
  }, function (error, response, body) {
    if(!error){
      if(response.statusCode == 201){
        console.info('success');
      } else {
        console.error(response.statusCode + ' error');
      }
    }
  });
```
- 计数
```javascript
request({
    url: 'esServer/index/type/_count',
    json: true,
    body: {
      "query": {
        "range" : {
            "date" : date_range
        }
      }
    }
  }, function (error, response, body) {
    if(!error){
      if(response.statusCode == 201){
        console.info('success');
      } else {
        console.error(response.statusCode + ' error');
      }
    }
  });
```
- 排序
```javascript
request({
    url: 'esServer/index/type/_search',
    json: true,
    body: {
      "query": {
        
      }
      "sort": [{
        "date": { // 以时间排序
            "order": "asc" //asc正序(默认)    desc倒序
        }
      }]
    }
  }, function (error, response, body) {
    if(!error){
      if(response.statusCode == 201){
        console.info('success');
      } else {
        console.error(response.statusCode + ' error');
      }
    }
  });
```