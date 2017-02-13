# let 和 const 命令

## 作用： 声明变量
## 与var区别
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
