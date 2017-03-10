有点生气， 博客数据库有两次数据库丢失。查看日志发现 有其它数据库被其它IP访问了， 应该是被攻击了。

果断加上认证机制。

下面对认证操作做简单记录。

因为我是以文件模式启动mongodb的，所以需要在 mongodb-start.conf里追加

      vi mongodb-start.conf
      auth=true

## 重启mongodb

    sudo /usr/local/mongodb/bin/mongod --shutdown 
    sudo /usr/local/mongodb/bin/mongod -f mongodb-start.conf


## 设置管理员账户

    use admin 
    db.createUser({
      user: 'admin',
      pwd: 'pwd,
      roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
    })
    show users
    db.system.users.find()

## 设置普通账户

    use blog
    db.createUser({
      user: 'sunny',
      pwd: 'sunny_pswd',
      roles: [ { role: "readWrite", db: "mydb" } ]
    })

## 验证权限

    sudo /usr/local/mongodb/bin/mongo
    use blog
    blog.auth('sunny', 'sunny_pswd')

## mongoose连接

    mongoose.connect('mongodb://sunnysunny_pswd@localhost/blog');



