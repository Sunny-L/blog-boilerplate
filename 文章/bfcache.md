# bfcache (for "Back-Forward Cache")

[Firefox 1.5](https://developer.mozilla.org/en-US/Firefox/Releases/1.5/Using_Firefox_1.5_caching) 使用对整个页面使用内存缓存， 包括js 状态，浏览器session。当浏览器在前进或者后退访问页面时，页面不会重新加载并且js中的状态值也会保存下来。将来， 通过前进后退缓存可以网页导航变的非常快。缓存的状态一直保留直到用用户关闭浏览器。

有一些情况Firefox不会缓存页面。下面是一些具体的原因。

- 页面中注册了 *unload* 或者 *beforeunload*事件
- 页面设置 "Cache-Control: nostore"
- 站点是htts 服务器并且页面设置了以下几个头
  - "Cache-control: no-cache"
  - "Pragma": "no-cache"
  - 设置"Expires:0"或者 "Expires"相对于date 头是一个过去的时间(除非 "Cache-control: max-age="也被声明了)
- 当用户跳转到其它页面时当前页面还没有完成加载完成或者其它网络请求还没有得到响应(比如 XMLHttpRequest)
- 页面在处理IndexedDB
- 页面最外层包含frames(比如 iframe),并且这些frames不能被缓存
- 页面在frames里面然后用户在frames里导航到新页面

## pigeshow事件
在onload事件事件之后执行 使用bfcache的页面不会执行onload事件，但是每次都会执行pageshow事件,通过event.persisted可以判断页面是否来自bfcache

```
    window.addEventListener('pageshow', e => {
      alert(e.persisted)
    })
```
以上是文档中所说，截至今日测试的结果有很大不同。

# 实际测试
操作系统： mac Sierra 10.12.5
- chrome 59后退时不使用bfcache,后退时页面每次会重新加载。
- firefox 54后退使用bfcache并且后退时e.persisted 为true
- safari 10.1.1 后退时使用bfcache 但不会执行pageshow事件

