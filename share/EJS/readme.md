# 基本语法

## 流程控制
### if else
```
<div><% if(msg) { %></div>
  <%=msg%>
<% } else {%>
  ....
<% } %>


```
### for
```
  <div><% products && products.forEach(item => { %></div>
    <%=item.goods_name%>
  <% }) %>
```
### 输出
```
<p><%=msg.replace(/dress/, 't-shirts')%></p>
```
### include

```
<% include('component/header')%>

<% include('component/procutItem', {goods: {}})%>
```

## express 服务端

```

// 默认ejs后缀
app.set('view engine', 'ejs')

// 设置html后缀
app.set('view engine', 'html')
app.engine('.html', require('ejs').__express)

app.get(*, (req, res, next) => {
  res.render('index', {
    msg: 'hello world',
    product: {
      name: 'dreess'
    }
  })
})


//index.ejs 
<p><%=msg%></p>


<script>
//不转义输出
var product = <%- JSON.stringify(product)%>
// {name: dress}

//转义输出
var product = <%= JSON.stringify(product)%>
{&#34;name&#34;:&#34;dress&#34;}
<script>

```

## 客户端

```
var str = '<p><%=%></p>',
  str2 = '<p><?=msg?></p>'
  data = {msg: 'hello world'}
var template = ejs.compile(str);
template(data);
// => Rendered HTML string

ejs.render(str2, data, {
  delimiter: '?'
})

```
## express layout 中间件


## 内部解析

![](https://www.processon.com/chart_image/58c21723e4b070abda0cc819.png)