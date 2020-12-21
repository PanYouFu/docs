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
    } else {
      // 参数收集完毕，则执行fn，清空args，抛出需要科里化的函数的执行结果
      const res = fn.apply(_this, args)
      args.splice(0, args.length)
      return res
    }
  }
}

// 案例1
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

// 案例3
const p =[
  { name: 'kk', age: '18' },
  { name: 'gg', age: '24' }
]

const getProp = currying(function(obj, key) {
  return obj[key]
})

const ages = p.map(item => {
  return getProp(item)('age')
})

console.log(ages) // ['18', '24']