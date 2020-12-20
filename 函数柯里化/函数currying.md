# 函数currying

## 定义

> 柯里化（Currying），是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。

>柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

## 举例

add函数

```javascript
// 普通add函数
function add(x, y) {
	return x + y
}
add(1, 2) // 3

// currying
function curringAdd(x) {
	return function(y) {
    return x + y
	}
}
curringAdd(1)(2) // 3
```

## 优势

### 参数复用

```javascript
// 正则校验 reg.test(txt) 需要两个量1、正则表达式；2、需校验的文本
function check(reg, txt) {
  return reg.test(txt)
}
check(/\d+/g, 'test')       //false
check(/[a-z]+/g, 'test')    //true

// curring
function curryingCheck(reg) {
  return function(txt) {
    return reg.test(txt)
  }
}
const hasNumber = curryingCheck(/\d+/g)
const isStr = curryingCheck(/[a-z]+/g)
hasNumber('test') // false
hasNumber('test1') // false
hasStr('test')  // true
```

### 提前确认

普通函数每次调用时都要做一次判断。currying化后，在定义是执行一次，后续直接使用，无需再做初始化判断

```JavaScript
const on = (element, event, element) => {
  // 每次使用这个函数时，都需要进行第一层的是否有监听事件的判断
  if (doucment.addEventListener) {
    if (element && event && handler) {
      element.addEventListener(event, handler, false)
    }
  } else {
    if (element && event && handler) {
      element.attachEvent('on' + event, handler, false)
    }
  }
}
on(element, event, element)

const onCurrying = (() => {
  if (doucment.addEventListener) {
    // 基础条件判断后返回一个可用的函数
    return (element, event, handler) => {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return (element, event, handler) => {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  }
})()
// 函数定义时，立即执行，经过一次判断，返回一个可用的函数
// 故当实际使用 onCurrying 时，无需再次判断
onCurrying(element, event, element)
```

### bind的实现

```javascript
// bind接受两个参数，需绑定的上下文(this)，原函数的入参
// 不使用箭头函数，因为箭头函数中没有arguments
Function.prototype.mybind = function(context) {
  // [1, 2, 3].slice(1) ---> 返回截取第一位以及后面的参数组成的数组 
  // 截取入参除第一位后的参数，及获取原函数参数，因为第一个参数是函数需绑定的上下文
  const args = Array.prototype.slice.call(arguments, 1)
  return () => {
    return this.apply(context, args)
  }
}
// ----
function test(x, y) {
	console.log(this.a + this.b + x + y)
}
const a = 'ss'
const b ='dd'
const o = {
	a: 'qqq',
	b: 'eee'
}
test('===', '---') // ssdd===---
const test2 = test.mybind(o, '===', '---')
test2() // qqqeee===---
```

## 封装Currying

### 初步封装

实现参数拼接，实现扩展一个参数调用。即：`f(3, 4, 5)`经过初步`currying`后，`t=currying(f, 3)`，`t(4, 5)`

```javascript
const simpleCurrying = function (fn) {
  // 获取除了当前函数的除了第一项外的参数
  const args = Array.prototype.slice.call(arguments, 1)
  // 返回一个方法，这个方法在调用时，可以不用再传第一参数
  // 即在实际使用时，有参数复用的好处
  return function () {
    // 获取到该方法使用时，获得的参数
    // 将该参数与之前的参数拼接，
    // 这里有一个闭包，因为这个函数用到了实际上下文之外的参数（args）
    let newArgs = args.concat(Array.prototype.slice.call(arguments))
    // 改变fn执行时的上下文，绑定为当前执行栈的上下文
    fn.apply(this, newArgs)
  }
}
// -------------------
const f = function (a, b, c) {
  console.log('this--',this)
  console.log(a + b + c + this.x + this.y)
}
const o = {
  x: 5,
  y: 9,
  t: simpleCurrying(f, 3)
}
o.t(6, 7) // 30
```

### 进一步封装

初步封装存在一定的缺陷，不能实现扩展多个参数。如上述案例，`o.t(6, 7)`不能扩展为`o.t(6)(7)`。基于此缺陷，我们需要进一步封装。思路：当我们发现返回的函数，参数还是多个时进行递归。

```javascript
const currying = function (fn, _args) {
    // 保存this，递归时保持this指向
    const _this = this
    // 获取原函数参数个数
    const len = fn.length
    // 获取传入的参数
    const args = _args || []
  
    // 科里化后返回一个函数
    return function () {
      // 获取所有参数
      // 注意：虽然 arguments 不是数组，但是 slice 返回的是一个数组，及 argsNow instanceof Array
      const argsNow = Array.prototype.slice.call(arguments)
      // 使用 apply 方法是因为：apply方法使用格式为apply(obj, [a, b, c])
      // 这样可以将 argsNow 中的参数 依次 push 进 args
      // 这样是改变的 args 的实际值，而不仅仅是修改引用，这样，后续递归时，才会获取到新的args的值
      Array.prototype.push.apply(args, argsNow)
  		
      // 如果参数整体个数依旧少于原函数需要参数个数，则进一步递归
      if (args.length < len) {
        return currying.call(_this, fn, args)
      } else if (argsNow.length === 2){
        // 参数收集完毕，则执行fn，清空args
        fn.apply(_this, argsFn)
        args.splice(0, args.length)
      }
    }
  }
  
	// 执行以下案例
  const testFn = function (a, b, c, d, e) {
    console.log(a, b, c, d, e)
  }
  
  let f1 = currying(testFn)
  f1(2)(3, 4)(5, 6) // 2 3 4 5 6
  f1('q')('w')('e')('r')('d') // q w e r d

	// 案例2，this
	const fn = function(x, y, z) {
    console.log(`${this.a}-${this.b}-${this.c}-${x}-${y}-${z}`)
  }
  const obj = {
    a: 'aaa',
    b: 'bbb',
    c: 'ccc',
    curry: currying
  }
  const f = obj.curry(fn)
  f(1, 2, 3) // aaa-bbb-ccc-1-2-3
```

## 经典面试题

```javascript
// 实现一个add方法，使计算结果能够满足如下预期：
add(1)(2)(3) // 6
add(1, 2, 3)(4) // 10
add(1)(2)(3)(4)(5) // 15
```

#### 思路

1、add不仅需要计算参数和，还得再抛出一个计算参数和的函数。

```javascript
// 累加函数
const arr = [3,9,4,3,6,0,9];
const add = function(arr.reduce(prev, cur) {
  return prev + cur
})
```

2、每一次调用后返回的函数利用`toString`方法隐式转换

```javascript
// toString 隐式调用
const f = function() {
	return 'function'
}
f.toString = function(){ return 'use toString' }

console.log(f) // 'use toString'
```

#### 实现

```javascript
function add() {
  // 第一次执行时，定义一个数组专门用来存储所有的参数
  const _args = Array.prototype.slice.call(arguments)

  // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
  const _adder = function () {
    _args.push(...arguments)
    return _adder
  }

  // 利用toString隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
  _adder.toString = function () {
    return _args.reduce(function (prev, cur) {
      return prev + cur
    })
  }
  return _adder
}

// add(1)(2)(3) 最后返回的还是一个_adder函数
// 但是通过toString方法，当我在获取这个函数的时候，执行了toString方法（隐式调用）
// _args一直保持的是最新的，当前参数组成的数组
console.log(add(1)(2)(3))
```



