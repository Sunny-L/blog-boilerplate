title: EJS模板引擎
speaker: 李旭
transition: slide1
theme: colors
usemathjax: yes

[slide]
# EJS 模板渲染
### Embedded JavaScript templates

[slide]
# 基本语法

[slide]
## 流程控制
### 判断
```
<div><% if(msg) { %></div>
  <%=msg%>
<% } else {%>
  ....
<% } %>
```
[slide]
### 循环
```
<div><% products && products.forEach(item => { %></div>
  <%=item.goods_name%>
<% }) %>
```
[slide]
### 输出
```
<p><%=msg.replace(/dress/, 't-shirts')%></p>
```
[slide]
### include
```
<% include('component/header.html')%>

<% include('component/procutItem.html', {goods: {}})%>
```

[slide]
## express 服务端
```

// 默认ejs后缀
app.set('view engine', 'ejs')

// 设置html后缀
app.set('view engine', 'html')
app.engine('.html', require('ejs').__express)
```
[slide]
```
app.get(*, (req, res, next) => {
  res.render('index', {
    msg: 'hello world',
    product: {
      name: 'dreess'
    },
    title: 'I am title ...'
  })
})
//index.html
<p><%=msg%></p>
<% include('header.html', {title: title})%>

<script>
//不转义输出
var product = <%- JSON.stringify(product)%>
// {name: dress}

//转义输出
var product = <%= JSON.stringify(product)%>
{&#34;name&#34;:&#34;dress&#34;}
<script>
```
[slide]

## 客户端

```
var str = '<p><%=%></p>',
  str2 = '<p><?=msg?></p>'
  data = {msg: 'hello world'}
var template = ejs.compile(str);
template(data);

ejs.render(str, data)

//分界符
ejs.render(str2, data, {
  delimiter: '?'
})
```
[slide]
## express layout 中间件
[slide]
## 源码解析

![](https://raw.githubusercontent.com/Sunnyson303/blog-boilerplate/master/share/EJS/base.png)

[slide]
![](https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTljxO2QYiNRXaZzUjjDgpAbIesiTKo1g31O2zjCMYvbCVNI5Mj)