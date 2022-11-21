## easycloud_uploader_backend

### 安装步骤：

1、运行initDB.js来初始化数据库

2、手动在user表中增加一管理员，role设置为admin，password为SHA2+salt方法加密，salt写在constant.js中

3、在constant.js中更改 STORE_ROOT_PATH 与 FTP_ROOT_PATH，分别代表生产环境中上传员FTP HOME与文件入库后实际存储位置。

4、在开发阶段，constant中DEV常量设置为true

5、其他constant勿动，可新增。

### 对接储存端

1、Azure AD: https://azure.microsoft.com/en-us/products/active-directory

2、Google 开发者平台：https://console.cloud.google.com/

3、百度云盘开发者平台：https://pan.baidu.com/union/home

### 待完成任务：

1、使用log4js输出日志到控制台与文件中

2、适配更多的存储端

3、优化代码结构

### 一些参考阅读：

https://segmentfault.com/q/1010000003779916
https://zhuanlan.zhihu.com/p/94019703
https://www.zhihu.com/question/20360521
https://www.zhihu.com/question/305042684
https://www.zhihu.com/question/49952592

Restful API: https://www.ruanyifeng.com/blog/2014/05/restful_api.html

流：
https://loveky.github.io/2017/06/05/translate-node-stream-everything-you-need-to-know/

SQL能否写在service层？
https://blog.csdn.net/y_dzaichirou/article/details/53673528

### 好用的前端库

https://juejin.cn/post/6977683045356830757

### async await 加强理解

https://cloud.tencent.com/developer/article/1751487

### Koa中的错误处理

https://www.52cik.com/2018/05/27/koa-error.html
https://segmentfault.com/a/1190000023327434
