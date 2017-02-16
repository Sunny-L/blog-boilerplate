# let 和 const 命令

## 作用： 声明变量
### 与var区别
  1. 块级作用域
  ```
  {
    let a = 10;
    var b = 1;
    const c = 11
  }

  console.log(a)
  //console.log(b)
  //console.log(c)

  var a = [];
  for (var i = 0; i < 10; i++) {
    a[i] = function () {
      console.log('var ' + i);
    };
  }
  a[6]();

  var a = [];
  for (let i = 0; i < 10; i++) {
    a[i] = function () {
      console.log('let ' + i);
    };
  }
  a[6]();
  ```
  2. 不存在变量提升

  ```
  // var 的情况
  console.log(foo); // 输出undefined
  var foo = 2;

  // let 的情况
  console.log(bar); // 报错ReferenceError
  let bar = 2;
  ```

  3. 暂时性死区

  理解：绑定作用域，不允许使用未声明的变量。

  ```
  var tmp = 123;

  if (true) {
    tmp = 'abc'; // ReferenceError
    let tmp;
  }
  ```

  4. 不允许重复声明

  ```
  // 报错
  function () {
    let a = 10;
    var a = 1;
  }

  // 报错
  function () {
    let a = 10;
    let a = 1;
  }
  ```

### const使用

  不可改变引用地址，只可改变引用对象

 ```
  const foo = {};
  foo.prop = 123;

  foo.prop
  // 123

  foo = {}; // TypeError: "foo" is read-only
  
  ```
# 变量的解构赋值

## 作用：从数组和对象中相应位置提取值，对变量进行赋值
解构时不是数组或者对象的都会转化成类似数组的对象

### 数组
```
//以前
let a = 1;
let b = 2;
let c = 3;
//现在
let [a, b, c] = [1, 2, 3];
let [foo, [[bar], baz]] = [1, [[2], 3]];
//不完全解构，只匹配对应的值
let [x, , y] = [1, 2, 3];


let { log, sin, cos } = Math;
```
如果位置不一致，变量的值就等于undefined

### 对象

```
let { foo, bar } = { foo: "aaa", bar: "bbb" };
foo // "aaa"
bar // "bbb
```
`与数组解构的不同点`
数组根据元素的位置而来，对象根据属性名

```
let { bar, foo } = { foo: "aaa", bar: "bbb" };
foo // "aaa"
bar // "bbb"

let { baz } = { foo: "aaa", bar: "bbb" };
baz // undefined
```
如果提取的属性名跟变量名不一样
```
let { first: f, last: l } = { first: 'hello', last: 'world' };
f // 'hello'
l // 'world'
```
真正被赋值的是后者，不是前者

复杂的嵌套对象
```
let obj = {
  p: [
    'Hello',
    { y: 'World' }
  ]
};

let { p: [x, { y }] } = obj;
x // "Hello"
y // "World"
```

### 字符串,数值和布尔值

```
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"

let {toString: s} = 123;
s === Number.prototype.toString // true

let {toString: s} = true;
s === Boolean.prototype.toString // true

let { prop: x } = undefined; // TypeError
let { prop: y } = null; // TypeError
```

### 函数参数
```
//以前
function before(arr) {
  return arr[0] + arr[1]
}
before([1,2]) //3
//现在
function now([x, y]){
  return x + y;
}

now([1, 2]); // 3
```

### 默认值
触发条件： 严格相等undefined
```
let [foo = true] = [];
foo // true

let [x = 1] = [undefined];
x // 1

let [x = 1] = [null];
x // null

以前
function log(x, y) {
  if (typeof y === 'undefined') {
    y = 'World';
  }
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello World

现在
function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello


// 写法一
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}

// 写法二
function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

// 函数没有参数的情况
m1() // [0, 0]
m2() // [0, 0]

// x和y都有值的情况
m1({x: 3, y: 8}) // [3, 8]
m2({x: 3, y: 8}) // [3, 8]

// x有值，y无值的情况
m1({x: 3}) // [3, 0]
m2({x: 3}) // [3, undefined]

// x和y都无值的情况
m1({}) // [0, 0];
m2({}) // [undefined, undefined]

m1({z: 3}) // [0, 0]
m2({z: 3}) // [undefined, undefined]


### 用途

交换变量的值
```
let x = 1;
let y = 2;

[x, y] = [y, x];

提取JSON数据 
```
//Function 
function example() {
  return {
    foo: 1,
    bar: 2
  };
}
let { foo, bar } = example();

//Object
let jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};

let { id, status, data: number } = jsonData;

console.log(id, status, number);
// 42, "OK", [867, 5309]
```

函数参数的定义

```
function f({x, y, z}) { 
  return x + y +z
 }
f({z: 3, y: 2, x: 1}); // 6
```

函数参数的默认值

```
function f({x=1, y, z}) { 
  return x + y +z
}
f({z: 3, y: 2}); // 6
```

# 模板字符串

拼接
```
以前
var hello = 'hello'
var hi = hello + 'world'
现在
var hi  = `${hello}`
```

# 函数的扩展

rest 参数（形式为 ...变量名）
作用： 用于获取函数的多余参数，参数中的变量代表一个数组

```
function add(...values) {
  //values = [2, 5, 3]
  let sum = 0;

  values.forEach(function(i) {
    sum += i
  })

  return sum;
}
add(2, 5, 3) // 10


// arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}

// rest参数的写法
const sortNumbers = function(...numbers){
  numbers.sort();
}

```

tips: rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错

```
// 报错
function f(a, ...b, c) {
  // ...
}
```

## 扩展运算符
作用：  将一个数组转为用逗号分隔的参数序列，rest 参数的逆运算

```
// ES5的写法
Math.max.apply(null, [14, 3, 77])

// ES6的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);

```

### 应用

合并数组
```
var more = [3, 4]
// ES5
[1, 2].concat(more)
// ES6
[1, 2, ...more]

var arr1 = ['a', 'b'];
var arr2 = ['c'];
var arr3 = ['d', 'e'];

// ES5的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```

与解构赋值结合

扩展运算符可以与解构赋值结合起来，用于生成数组。

```
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]

const [first, ...rest] = [];
first // undefined
rest  // []:

const [first, ...rest] = ["foo"];
first  // "foo"
rest   // []
```

## 箭头函数

作用： 使用“箭头”（=>）定义函数

```
以前
var f = function(v) {
  return v;
};
现在
var f = v => v;

//如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。
var f = () => 5;
// 等同于
var f = function () { return 5 };

var sum = (num1, num2) => num1 + num2;
// 等同于
var sum = function(num1, num2) {
  return num1 + num2;
};

//如果想返回一个对象，必须在对象外面加上括号。
var getTempItem = id => ({ id: id, name: "Temp" });

//箭头函数可以与变量解构结合使用
const full = ({ first, last }) => first + ' ' + last;

// 等同于
function full(person) {
  return person.first + ' ' + person.last;
}

简化回调函数
// 正常函数写法
var result = values.sort(function (a, b) {
  return a - b;
});

// 箭头函数写法
var result = values.sort((a, b) => a - b);


//rest参数与箭头函数结合的例子
const numbers = (...nums) => nums;

numbers(1, 2, 3, 4, 5)
// [1,2,3,4,5]

```
注意点
函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象
箭头函数中是不可变的 不能用bind, call, apply更改宿主元素
```
// ES5
function foo() {
  var _this = this;

  setTimeout(function () {
    console.log('id:', _this.id);
  }, 100);
}
// es6
function foo() {
  setTimeout(() => {
    console.log('id:', this.id);
  }, 100);
}
var id = 21;
foo.call({ id: 42 });
// id: 42
```

# 对象的扩展

## 属性的简洁表示法
作用： 写对象字面量时直接写入变量和函数，作为对象的属性和方法

```
var foo = 'bar';
var o = {
  foo,
  method() {
    return "Hello!";
  }
};

// 等同于

var o = {
  foo: 'bar',
  method: function() {
    return "Hello!";
  }
};
```
## 属性名表达式
作用： 对象属性名可以用表达式表示
```
// 方法一
obj.foo = true;

// 方法二
obj['a' + 'bc'] = 123;
```

es6

```
let propKey = 'foo';

let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123,
  ['h' + 'ello']() {
    return 'hi';
  }
};
```

# Promise对象

## 描述： 
简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果
它允许你为异步操作的事件结果"成功返回的值"或"失败"绑定一个处理方法。 这使得异步方法可以像同步方法那样返回值：不同于立即返回最终结果, 异步方法返回一个promise对象,

Promise有以下几种状态:

pending: 初始状态, 既不是 fulfilled 也不是 rejected.
fulfilled: 表示操作被成功完成.  
rejected: 表示该操作失败.

#### Promise.prototype.then(onFulfilled, onRejected)

```
var promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
promise.then(successFn, errorFn)
```

#### Promise.prototype.catch
其实是Promise.prototype.then(null, rejection)的别名,用于指定发生错误时的回调函数。
Promise对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个catch语句捕获。

```
promise.then(null, errorFn)
```

![img](http://p0.qhimg.com/t016690930b5486b0b2.png)


```
回调地狱
function fetchData(done){
  $.ajax({
    url1,
    success(value1) {
      $.ajax({
        url2,
        data: value1,
        success(value1) {
          done(value2）
        },
        error(err) {
          
        }
      })
    }
  })
}

fetchData((data) => {
  //do something ...
}）


链式调用
function fetcData1() {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url,
      success(valur) {
        resolve(value);
      },
      error(err) {
        reject(error);
      }
    })
  });
}
function fetcData2(value) {
  return new Promise(function(resolve, reject) {
    $.ajax({
      url,
      data: value
      success(value) {
        resolve(value);
      },
      error(err) {
        reject(error);
      }
    })
  });
}
fetcData1().then(function(value) {
  return fetcData2(value)
}).then((data) => {
  //do something ...
}).catch((err) => {
  //do err ...
});
```


# Module 的语法
## export 语句用于从给定的文件 (或模块) 中导出函数，对象
module a.js
1. 命名导出
``
var myFunction = function() {

}
export { myFunction }; // 导出一个函数声明
export const foo = Math.sqrt(2); // 导出一个常量
``
2. 默认导出 (每个脚本只能有一个)：

```
export default myFunctionOrClass 
```

于只导出一部分值来说，命名导出的方式很有用。在导入时候，可以使用相同的名称来引用对应导出的值。

关于默认导出方式，每个模块只有一个默认导出。一个默认导出可以是一个函数，一个类，一个对象等。当最简单导入的时候，这个值是将被认为是”入口”导出值。


## import 语句用于导入从外部模块，另一个脚本等导出的函数，对象
module b.js

```
import a, {myFunction, foo} from './a'
```