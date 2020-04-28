- mac 下 mysql 服务操作
```bash
# 启动
mysql.server start
# 停止
mysql.server stop
# 重启
mysql.server restart
```

- mysql 连接

```bash
# 创建用户，host 如果为 %，则通配所有域名
CREATE USER 'username'@'host' IDENTIFIED BY 'password';
# 例子：
CREATE USER 'pig'@'192.168.1.101_' IDENDIFIED BY '123456';
CREATE USER 'pig'@'%' IDENTIFIED BY '123456';

# 授权，privileges 包括 SELECT，INSERT，UPDATE，ALL 等，这个授权操作会创建一个用户
GRANT privileges ON databasename.tablename TO 'username'@'host' identified by 'password';
# 列子
GRANT SELECT, INSERT ON test.user TO 'pig'@'%';
GRANT ALL ON *.* TO 'pig'@'%';

# 刷新权限
flush privileges;

# 使创建的用户能够对其他用户授权
GRANT privileges ON databasename.tablename TO 'username'@'host' identified by 'password' WITH GRANT OPTION;
# 设置与更改用户密码
SET PASSWORD FOR 'username'@'host' = PASSWORD('newpassword');
# 删除用户
DROP USER 'username'@'host';

# 添加非删除权限
GRANT CREATE,INDEX,SELECT,INSERT,UPDATE,CREATE VIEW,SHOW VIEW,ALTER ROUTINE,CREATE ROUTINE,EXECUTE,CREATE TEMPORARY TABLES ON *.* TO 'developer'@'%';

# 删除权限

# 显示权限
SHOW GRANTS FOR 'developer'@'%';

# 显示所有用户
select User from mysql.user;

# 报错 ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456789';
```

- 自增id被搞混乱过后，还原为自增id
```bash
# 删除原有主键id
ALTER  TABLE  `table_name` DROP `id`;
# 再重建主键id
ALTER  TABLE  `table_name` ADD 'id' mediumint(6) PRIMARY KEY NOT NULL AUTO_INCREMENT FIRST;
（在myslq中，上述的单引号不需要）

# 查看自增 id 增长到的数值
SELECT `AUTO_INCREMENT` FROM  INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'DatabaseName' AND   TABLE_NAME   = 'TableName';
# 查看自增的字段
DESCRIBE `table_name`
```
- 合并表，并使id自增（如果不处理，id会冲撞）
```bash
# 方式一，将表二的id依次加上表一的长度，再将表二合并到表一
update table2 SET ID=ID+(SELECT MAX(ID) FROM table1);
insert into table2 select * from table1;
# 方式二，直接将表二的非id数据导入表一，表一的id自动增加
# 注意所有列都要写出，并且列顺序一致
insert into table2 select name,sex,age from table1;
# 或不要求顺序一致
insert into table2(sex,name,age) select sex,name,age from table1;
```
- 统计表中一对多的个数
```bash
# 统计一个vid对应多个uid的vid数目
# （括号里的语句相当于返回一个新表，并命名为A）
select count(*) 
from (
select vid, count(distinct uid) as cnt
from table
group by vid
having cnt > 1) A;
```
- 一次建立建立索引
```bash
ALTER TABLE table1 ADD INDEX ip_index(ip), ADD INDEX fp_index(fp), ADD INDEX vid_index(vid), ADD INDEX stime_index(stime);
```
- 复制表
```bash
create table table12 like table1;
insert into table12 select * from table1;
```
- 从另一个表插入数据
``` bash
insert into t_nations_info (sCode, sCNName, sENName, sRegion) select code,zh_name,en_name,region from t_r_country_info_list t  where code in ('KE') ON DUPLICATE KEY UPDATE sRegion=t.region;
```
- 新建列
```bash
ALTER TABLE table1 ADD isoverwrite int(8) DEFAULT 0 NULL;
```
- 创建表
```bash
CREATE TABLE `tabel1` (`id` bigint(20) NOT NULL AUTO_INCREMENT,  `sdate` date DEFAULT NULL,  `stime` time DEFAULT NULL,  `ip` varchar(32) DEFAULT NULL,  `uid` bigint(20) DEFAULT NULL,  `vid` varchar(16) DEFAULT NULL,  `isgen` int(8) DEFAULT 0,  `fp` varchar(66) DEFAULT NULL,  `ustat` varchar(60) DEFAULT NULL,  `ua` text,  `ref` text,  `err` text,  `clientua` text,  `fpua` varchar(32) DEFAULT NULL,  `fpdetail` text,  `cvid` varchar(16) DEFAULT NULL,  PRIMARY KEY (`id`),  KEY `idx_uid` (`uid`)) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
```
- 从文件日志导入数据库
```bash
LOAD DATA LOCAL INFILE "D:/user-unique/20180125data/c_20180125.txt"  REPLACE  INTO TABLE `c_201801。。` FIELDS   TERMINATED BY "\t"   ENCLOSED BY ""   ESCAPED BY "\\"   LINES TERMINATED BY "\n"   (sdate, cvid, vid, isgen, isgen2, uid, fp, ustat, ip, ua, ref, err, clientua, fpua, fpdetail);
```
- 多表联合查询
```bash
# 计算表一二中，每个唯一id的数目，去掉group，则统计所有vid的数目
# （括号里的语句相当于返回一个新表，并命名为x）
select count(*) from 
(select * from table1 union all select * table2) x 
where isgen=1 group by x.vid;
```

- 查询昨天的数据
```bash
select * from table_name where DATE(insert_time) = CURDATE()-1;
```

- 编码查看与配置
```bash
# 查看数据库编码
show variables like '%char%';
status;
# 查看 table 编码
show create table <表名>;
# 查看字段编码
show full columns from <表名>;
# 设置数据库编码
alter database <数据库名> character set utf8mb4;
# 设置表编码
alter table <表名> character set utf8mb4;
# 设置字段编码
ALTER TABLE <表名> MODIFY COLUMN <字段名> <字段类型> CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

- 修改字段
```bash
# 修改字段名以及数据类型
ALTER  TABLE 表名 CHANGE 旧字段名 新字段名 新数据类型;
# 修改字段数据类型
ALTER  TABLE 表名 MODIFY COLUMN 字段名 新数据类型 新类型长度  新默认值
```

- 移动表到另一个数据库
```bash
alter table database.table rename database1.table
```