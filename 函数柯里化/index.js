// 初步封装
// const simpleCurrying = function (fn) {
//   // 获取除了当前函数的除了第一项外的参数
//   const args = Array.prototype.slice.call(arguments, 1)
//   // 返回一个方法，这个方法在调用时，可以不用再传第一参数
//   // 即在实际使用时，有参数复用的好处
//   return function () {
//     // 获取到该方法使用时，获得的参数
//     // 将该参数与之前的参数拼接，
//     // 这里有一个闭包，因为这个函数用到了实际上下文之外的参数（args）
//     let newArgs = args.concat(Array.prototype.slice.call(arguments))
//     // 改变fn执行时的上下文，绑定为当前执行栈的上下文
//     fn.apply(this, newArgs)
//   }
// }
// var f = function (a, b, c) {
//   console.log('this--',this)
//   console.log(a + b + c + this.x + this.y)
// }
// var o = {
//   x: 5,
//   y: 9,
//   t: simpleCurrying(f, 3)
// }
// var x = 33
// var y = 99
// var t2 = currying(f, 3)
// o.t(6, 7)
// t2(6, 7)

const currying = function (fn, _args) {
  const _this = this
  const len = fn.length
  let args = _args || []

  return function () {
    const argsNow = Array.prototype.slice.call(arguments)

    if (argsNow.length === 1) {
      // Array.prototype.push.apply(args, argsNow)
      args = [1, 2, 3]
      return currying.call(_this, fn, args)
    } else if (argsNow.length === 2) {
      Array.prototype.push.apply(args, argsNow)
    }
  }
}

const testFn = function (a, b, c, d, e) {
  console.log(a, b, c, d, e)
}
let f1 = currying(testFn)
let x = f1(2)(3, 4)
f1()
// f1('q')('w')('e')('r')('d')
// f1('ss')('cc')('oo')('ll~~')('xx')
