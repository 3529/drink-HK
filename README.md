# 介绍 
由于平日喝水较少，身体出现这那的问题，因此做了个小程序，每天提醒我喝水，并且记录下我每天的饮水量。:bowtie:

本项目采用 `微信云开发` 来做服务端，云函数只涉及到了增删改查的一些简单操作，适合初学者学习。

学习到知识：

* wxs 语法（由于云函数查询到的时间为GMT格式，需要用类似 filter 的方式去格式化，因此用到了 wxs）
* cron 表达式 （由于云开发的局限性，无法在有限资源内实现用户自定义时间推送，因此采用了微信定时触发器来实现定时推送）
* 云数据库简单语法
* 其他一些处理数据的小技巧

后期会继续加入一些有意思的功能，一起进步！:smiley:

# 如何运行？
* 1、clone 项目并导入至小程序 
``` 
git clone https://github.com/3529/drink-HK.git
```
* 2、云数据库新建以下集合 `user`、 `push_queue`、 `push_record`
* 3、部署所有云函数
* 4、package.json 目录下运行命令
```
npm install
``` 
* 5、菜单栏 - 工具 - 构建npm
* 6、至此就完成啦，点击编译，console 不报错即可

:star::star::star:有问题可以提 issue 哦，看到会回答 ^.^。:star::star::star:

# 小程序预览
![miniappcode](https://6472-drink-hk-1gws5hab86b8850a-1308821162.tcb.qcloud.la/gh_3a2812999f41_344.jpg?sign=8415f90c0c5c1ffcfaaedcce92215f14&t=1644910838)




