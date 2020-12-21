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
console.log(add(1)(2)(3)) // 6