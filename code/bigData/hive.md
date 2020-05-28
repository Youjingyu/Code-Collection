## hive

### 注意事项
- 字段不能删除，只能在末尾 append 新字段
- select 出来的字段和 hive 字段必须按顺序一一对应

### 修改表结构步骤
- 删除分区数据 alter table t_td_ad_server_overview_temp drop partition(ds=${YYYYMMDD});
- 在 s3 删除对应的数据
- 整体替换字段 alter table t_td_ad_server_overview_temp replace columns (xxx)

### emr
- 复制代码到 emr aws s3 cp  s3://bucket-id/path/ .  --recursive && sh xxx.sh