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

function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]

function move({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```
### 用途

交换变量的值
```
let x = 1;
let y = 2;

[x, y] = [y, x];

提取数据 
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

