- 自增id被搞混乱过后，还原为自增id
```bash
// 删除原有主键id
ALTER  TABLE  `table_name` DROP `id`;
// 再重建主键id
ALTER  TABLE  `table_name` ADD 'id' mediumint(6) PRIMARY KEY NOT NULL AUTO_INCREMENT FIRST;
（在myslq中，上述的单引号不需要）
```