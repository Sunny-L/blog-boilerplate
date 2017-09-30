### 问题描述
在zepto中做事件绑定时需要父元素跟子元素分别做委托，在点击子元素时防止事件冒泡到父元素上，代码如下

```
<body>
  <div class="app">
    <div class="parent">
      parent
      <p class="child">
        child
      </p>
    </div>
  </div>
</body>

<script>
$(document).on('click', '.parent', function(e) {
  console.log('parent click ...')
})
$(document).on('click', '.child', function (e) {
  e.stopPropagation()
  console.log('child click ...')
})
</script>
```

当点击child时，我们期望的结果是输出 

```
child click ...
```
jQuery中输出我们这样的，但是zepto里输出的却是
```
parent click ...
child click ...
```

防止冒泡失效了，我想这应该zepto里的实现问题了，带着我的疑问来看看它们的源码~

在zepto 中

[on](https://github.com/madrobby/zepto/blob/324cd27c9949ff482a9080c1945ea09e94c4abec/src/event.js#L178)事件定义在`src/event.js`中

```
$.fn.on = function(event, selector, data, callback, one){
    var autoRemove, delegator, $this = this
    if (event && !isString(event)) {
      $.each(event, function(type, fn){
        $this.on(type, selector, data, fn, one)
      })
      return $this
    }

    // 参数处理，对未定义的参数做前置处理， one定义为只执行一次后就销毁，与once同样的效果，
    // 不过这里有个问题，当需要one为true时，需要给data赋一个默认值，否则会报错
    
    if (!isString(selector) && !isFunction(callback) && callback !== false)
      callback = data, data = selector, selector = undefined
    if (callback === undefined || data === false)
      callback = data, data = undefined

    if (callback === false) callback = returnFalse

    return $this.each(function(_, element){
      if (one) autoRemove = function(e){
        remove(element, e.type, callback)
        return callback.apply(this, arguments)
      }

      // 有selector 表示是事件代理，创建代理回调函数
      if (selector) delegator = function(e){
        var evt, match = $(e.target).closest(selector, element).get(0)
        if (match && match !== element) {
          evt = $.extend(createProxy(e), {currentTarget: match, liveFired: element})
          // 这里是关键， 即使我们在callback里执行了e.stopPropagation(),但因为e.target并不是实际需要停止
          // 冒泡的target,而是停止了宿主元素冒泡~~
          return (autoRemove || callback).apply(match, [evt].concat(slice.call(arguments, 1)))
        }
      }
      // addEventListener的封装
      add(element, event, callback, data, selector, delegator || autoRemove)
    })
  }
```

来看看[add方法是怎么实现的](https://github.com/madrobby/zepto/blob/324cd27c9949ff482a9080c1945ea09e94c4abec/src/event.js#L50)

```
function add(element, events, fn, data, selector, delegator, capture){
  var id = zid(element), set = (handlers[id] || (handlers[id] = []))
  events.split(/\s/).forEach(function(event){
    if (event == 'ready') return $(document).ready(fn)
    var handler   = parse(event)
    handler.fn    = fn
    handler.sel   = selector
    // emulate mouseenter, mouseleave
    if (handler.e in hover) fn = function(e){
      var related = e.relatedTarget
      if (!related || (related !== this && !$.contains(this, related)))
        return handler.fn.apply(this, arguments)
    }
    handler.del   = delegator
    var callback  = delegator || fn
    // 回调函数
    handler.proxy = function(e){
      e = compatible(e)
      if (e.isImmediatePropagationStopped()) return
      e.data = data
      var result = callback.apply(element, e._args == undefined ? [e] : [e].concat(e._args))
      if (result === false) e.preventDefault(), e.stopPropagation()
      return result
    }
    handler.i = set.length
    set.push(handler)
    // 创建完代理事件后执行原生绑定
    if ('addEventListener' in element)
      element.addEventListener(realEvent(handler.e), handler.proxy, eventCapture(handler, capture))
  })
}
```
add方法基本就是实现一下原生的绑定将委托的回调处理完，
可以看到zepto内部在创建delegator回调函数时并没有对事件冒泡做处理。所以我们的代码自己是没有用的啦。

再来大概看看[jQuery event](https://github.com/jquery/jquery/blob/master/src/event.js) 里面的实现:

主要是[jQuery.event.add方法](https://github.com/jquery/jquery/blob/7037facc2243ec24c2b36b770236c05d300aa513/src/event.js#L106)

```

add: function( elem, types, handler, data, selector ) {

  ......

  //创建代理回调
  if ( !( eventHandle = elemData.handle ) ) {
    eventHandle = elemData.handle = function( e ) {

      // Discard the second event of a jQuery.event.trigger() and
      // when an event is called after a page has unloaded
      return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
        //不是特殊的事件执行jQuery Event定义的dispatch方法
        jQuery.event.dispatch.apply( elem, arguments ) : undefined;
    };
  }
  
  .....

},
```
看看[dispatch](https://github.com/jquery/jquery/blob/7037facc2243ec24c2b36b770236c05d300aa513/src/event.js#L294)做了什么

```
dispatch: function( nativeEvent ) {

    //将原生事件转为jQuery实现的事件 这个事件对象原型上有stopPropagation、isPropagationStopped方法，
    //当我们在执行e.stopPropagation()时，isPropagationStopped返回true
		// Make a writable jQuery.Event from the native event object
		var event = jQuery.event.fix( nativeEvent );

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
    //依次处理当前元素绑定的委托事件回调， 如果停止冒泡则不执行它后面绑定的回调
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

          //执行后面的回调
					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

    ...


	},
```

在jQuery中做事件绑定时，它将每个事件转换成了自己Event对象。

在做代理时，会对每个绑定的元素与回调函数注册一个Event对象，放到一个执行队列中， 

如果它的父元素也有做代理，则也放入这个执行队列中。

当代理事件执行时，循环执行这个队列，如果回调函数有停止冒泡，这个执行队列里后面的绑定将停止执行。

### 小结

这是zepto的bug,而且现在都[没解决](https://github.com/madrobby/zepto/issues/1047), 不过我们还是有很多其它方法去解决我们的需求的。
