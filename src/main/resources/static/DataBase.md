# DataBase

## Mysql

#### 调优：

我们先来假设我们有一个表，表里有下面两个字段,分别是主键 id，和两个普通字段 c 和 d。

mysql> CREATE TABLE `t` (
`id` int(11) NOT NULL,
`c` int(11) DEFAULT NULL,
`d` int(11) DEFAULT NULL,
PRIMARY KEY (`id`)
) ENGINE=InnoDB;

1.建立索引

  a:查询尽量避免全表扫描，

  b:首先考虑where、order by 建立索引

  c:应尽量避免在 where 子句中对字段进行 null 值判断,否则将导致引擎放弃使用索引而进行全表扫描，如select id from t where num is null 可以在num上设置默认值0，确保表中num列没有null值，然后这样查询：select id from t where num=0

d:应尽量避免在 where 子句中使用!=或<>操作符，否则将引擎放弃使用索引而进行全表扫描。

g:应尽量避免在 where 子句中使用 or 来连接条件，否则将导致引擎放弃使用索引而进行全表扫描，如：select id from t where num=10 or num=20 可以这样查询：

select id from t where num=10	

union all 

select id from t where num=20

h:应尽量避免在 where 子句中对字段进行表达式操作where左边做运算不能走索引。如：	
select id from t where num/2=100	
应改为:	
select id from t where num=100*2

g:函数操作不走索引

select id from t where pow（c,2）=1000

减少 or，in，not in，%xxx%语法的使用。		

```
2.分表技术
3.存储过程（一般不要不用）
4.应用层方面：
采用缓存机制，将常用的数据进行缓存，增加访问速度
分库分表，读写分离，将数据分开读写，提升性能
对mysql配置优化 [配置最大并发数my.ini, 调整缓存大小 ]
mysql服务器硬件升级
```

#### 数据库设计三大方式：

1.每一列都是不可分割的原子数据项(不可重复)

2.要求其他字段都依赖于主键

3.消除传递依赖，方便理解，可以看做是“消除冗余”

#### 数据库系统必须维护事务的以下特性(简称ACID)：

###### ⑴ 原子性（Atomicity）

　　原子性是指事务包含的所有操作要么全部成功，要么全部失败回滚，因此事务的操作如果成功就必须要完全应用到数据库，如果操作失败则不能对数据库有任何影响。

###### ⑵ 一致性（Consistency）

　　一致性是指事务必须使数据库从一个一致性状态变换到另一个一致性状态，也就是说一个事务执行之前和执行之后都必须处于一致性状态。

　　拿转账来说，假设用户A和用户B两者的钱加起来一共是5000，那么不管A和B之间如何转账，转几次账，事务结束后两个用户的钱相加起来应该还得是5000，这就是事务的一致性。

###### ⑶ 隔离性（Isolation）

　　隔离性是当多个用户并发访问数据库时，比如操作同一张表时，数据库为每一个用户开启的事务，不能被其他事务的操作所干扰，多个并发事务之间要相互隔离。

　　即要达到这么一种效果：对于任意两个并发的事务T1和T2，在事务T1看来，T2要么在T1开始之前就已经结束，要么在T1结束之后才开始，这样每个事务都感觉不到有其他事务在并发地执行。

　　关于事务的隔离性数据库提供了多种隔离级别。

###### ⑷ 持久性（Durability）

　　持久性是指一个事务一旦被提交了，那么对数据库中的数据的改变就是永久性的，即便是在数据库系统遇到故障的情况下也不会丢失提交事务的操作。

###### 一条sql执行慢

1.一直慢=sql写的原因

2.偶尔慢：

a:当我们更新，或者插入一条数据时，我们知道数据库会在内存更新但更新之后这些字段不会马上同步持久化到磁盘中而会把这些更新新增记录到redo log中等数据库空闲时，在通过redo log的日子记忆把最新的数据同步到磁盘中去，不过redo log容量也时有限的如果数据库很忙更新又很频繁，这时候redo log 很快就会写满这时就没办法等到空闲的时候再把数据同步到磁盘中去，这个时候就会导致我们正常的sql语句突然直线很慢，所以数据库在同步数据到磁盘时，就很有可能导致我们的sql语句执行的很慢。

b:拿不到锁，我们执行语句涉及的表加锁，别人再用并且加了锁，我们只能等待别人释放锁过后，如果加的时行锁等用到这行也造成等待，我们可以判断是否真的在等待，我们可以用 show processlist命令来查看当前状态。