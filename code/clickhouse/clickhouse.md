## 查询status分布百分比
```bash
SELECT
    $timeSeries as t,
    sum(status=200)/count(1)*100 as status_200,
    sum(status=404)/count(1)*100 as status_404,
    sum(status=500)/count(1)*100 as status_500,
    sum(status!=200 and status!=404 and status!=500)/count(1)*100 as others
FROM $table
WHERE $timeFilter and logType='xxxx' and status!=0
GROUP BY t
ORDER BY t
```
## 一个复杂查询的示例
```bash
SELECT
    t,
    status, 
    numb, 
    total, 
    round(numb / total, 4) AS pre
FROM 
(
    SELECT 
        $timeSeries as t, 
        status, 
        count(*) AS numb
    FROM $table
    WHERE $timeFilter AND status!=0 and logType='xxxx'
    GROUP BY t, status
) 
GLOBAL ANY LEFT JOIN 
(
    SELECT 
        $timeSeries as t,
        count(*) AS total
    FROM $table 
    WHERE $timeFilter AND status!=0 and logType='xxxx'
    GROUP BY t
) USING (t)
ORDER BY t
```