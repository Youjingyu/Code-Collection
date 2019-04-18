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