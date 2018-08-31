express中的body-parse是最常使用的中间件了,这个中间件主要作用是处理http请求体中的内容.

文档解释

Node.js 请求体解析中间件
在你处理请求之前解析请求过来的请求体，然后会挂载到`req.body`对象下.
**提示** 因为`req.body`对象是基于用户的输入，所有属性都应该验证过才视为安全。例如，`req.body.foo.toString()`在以
multiple请求的时候可能会报错，`foo`可能不存在或者不是一个字符串类型，也有可能`toString`不是一个函数或者是用户发起的其它
数据类型

因为multipart方式请求的数据过大而且复杂, 所以这个中间件不处理multipart方式请求的请求体.

express中日常用法

```
var express = require('express')
var bodyParser = require('body-parser')

var app = express()
// create application/json parser
var jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(jsonParser)
app.use(urlencodedParser)
```

其中`jsonParser`可以解释通过 `application/json`头的请求，`urlencodedParser`处理默认ajax或者表单请求

`urlencodedParser`里的`extended`是用来配置用`qs`(设置为`true`时)模块还是`querystring`(设置为`false`时))模块来处理`url encode`过的数据

`qs`与`querystring`的区别在于 `qs`能解析复杂的嵌套对象，而`querystring`只是解析一层嵌套的对象

问题描述

express中简单的接收一个简单post请求，如下
```
app.use('/users', (req, res, next) => {
    const {userIds} = req.body
    res.json(userIds)
})
```
这里的`userIds`接收一个数组，当请求的数组元素只有2个时

```
    //userIds = { userIds: '1' } 
```

当请求的数组元素只有2个时
```
    //userIds = { userIds: [ '1', '2' ] } 
```

因为返回的解析出来的数据结构不一致，导致使用参数时就需要加上兼容。

查看`querystring`源码时发现它是这样做解析的

```

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }
    //qs是encode后的字符串
  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    // 对象触解析，判断是否解析过
    if (!hasOwnProperty(obj, k)) {
    // 没有解析过生成一个k值
      obj[k] = v;
    } else if (Array.isArray(obj[k])) {
      obj[k].push(v);
    } else {
    // 解析过合成到数组中， 这里就是产生问题的原因了~
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

```
问题找到了。

解决方法

可以通过设置 `Content-Type = application/json`的方式来发起请求，这样无论传一个参数还是两个参数数据结构都会统一了

```
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:4001/users",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
  },
  "processData": false,
  "data": "{\n\t\"userIds\": [1]\n}"
}

$.ajax(settings).done(function (response) {
  console.log(response);
});
```