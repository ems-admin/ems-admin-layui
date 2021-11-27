# ems-admin-layui

#### 介绍
ems-admin(easy manage system)是一套极简的后台管理系统，
基于SpringBoot2.5.2、SpringSecurity、Mybatis-plus3.4.3.4、Mysql8.0、
JWT、Vue3.0、Layui2.6.8开发，
只提供最基础的登录、权限管理功能与日志功能，所有的业务功能，
都可以根据自己的需要在此之上构建。

ems-admin-layui是ems-admin前端的layui版本，后台为基本SpringBoot开发的ems-admin-boot


[![AUR](https://img.shields.io/badge/license-Apache%20License%202.0-blue.svg)](https://github.com/ems-admin/ems-admin-boot/blob/master/LICENSE)
[![star](https://gitee.com/ems-admin/ems-admin-layui/badge/star.svg?theme=white)](https://gitee.com/ems-admin/ems-admin-layui)
[![GitHub stars](https://img.shields.io/github/stars/ems-admin/ems-admin-layui.svg?style=social&label=Stars)](https://github.com/ems-admin/ems-admin-layui)
[![GitHub forks](https://img.shields.io/github/forks/ems-admin/ems-admin-layui.svg?style=social&label=Fork)](https://github.com/ems-admin/ems-admin-layui)

[ems-admin-layui演示站点](http://ems-admin-layui.facebook47.cn/)

 - **<font color=red>提示：首次启动会报错，再次启动就正常了！首次启动会报错，再次启动就正常了！首次启动会报错，再次启动就正常了！</font>**

####    操作提示

- 下载项目
- 进行项目目录，执行npm install 下载依赖
- 执行 npm run serve 启动项目
- 执行 npm run build 打包项目

#### 支持功能

-  登录
    - 账号/密码 admin/123456


-  用户管理
    - 添加、编辑、删除、停用/启用、查询


-  菜单管理
    - 添加、编辑、删除、查询


-  角色管理
    - 添加、编辑、删除、授权、查询


-  日志管理
    - 查询


#### 交流反馈

- ems-admin-layui技术群: `211296170`


- [issues 问题反馈](https://github.com/ems-admin/ems-admin-layui/issues)


- [更新日志](CHANGELOG.md)


#### 软件架构

- 登录和访问控制通过SpringSecurity 和 JWT来完成


- 用户的访问权限，通过用户-角色-权限的方式进行绑定


#### 后续计划

- 提供验证码功能


- 提供token自动续租功能


- 优化权限的细粒度，目前是通过请求路径进行了校验，还没有精确到按钮


#### 已知问题

- 首次启动会报错，会报一个关于layui的错，再次启动就好了， 所以打包也需要打包两次，第一打包也会报错，第二次打包就好了



