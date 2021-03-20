# lazyMan

> 考察链式调用

#### 题目

```javascript
LazyMan('Tony');
// Hi I am Tony

LazyMan('Tony').sleep(10).eat('lunch');
// Hi I am Tony
// 等待了10秒...
// I am eating lunch

LazyMan('Tony').eat('lunch').sleep(10).eat('dinner');
// Hi I am Tony
// I am eating lunch
// 等待了10秒...
// I am eating diner

LazyMan('Tony').eat('lunch').eat('dinner').sleepFirst(5).sleep(10).eat('junk food');
// Hi I am Tony
// 等待了5秒...
// I am eating lunch
// I am eating dinner
// 等待了10秒...
// I am eating junk food
```

#### 思路

+ 新增LazyMan类，包含eat等方法
+ 需要链式调用，后一个方法需在前一个方法执行完成后再执行。设计队列数据结构，方法先进先出。
+ 在同步方法执行完成后，得到，需要实际执行函数的队列结构。
+ 使用setTimeOut 将这些方法，防止异步消息队列中。
+ 同步方法结束后。栈清空，查找消息队列，宏任务settimeout开始执行。
+ 通过next方法不断调用队列里的下一个方法。
+ 每次执行栈中只有一个方法，所以即使这个方法是异步的，后面方法的也不会超前执行。

#### 代码

```javascript
class LazyManClass {
  constructor(name) {
    this.name = name
    this.taskList = []
    console.log(`I am ${name}`)
    // 将方法放入消息队列
    setTimeout(() => {
      this.next()
    }, 0)
  }
  eat(food) {
    const fn = ((name) => {
      return () => {
        console.log(`I am eating ${name}`)
        // 返回的方法中，需调用next，触发方法队列后续方法的执行
        this.next()
      }
    })(food)
    this.taskList.push(fn)
    return this
  }
  sleep(time) {
    const fn = (time => {
      return () => {
        setTimeout(() => {
          console.log(`sleep time is ${time}`)
          this.next()
        }, time)
      }
    })(time)
    this.taskList.push(fn)
    return this
  }
  sleepFirst(time) {
    const fn = ((time) => {
      return () => {
        setTimeout(() => {
          console.log(`go to sleep now ! ${time}`)
          this.next()
        }, time)
      }
    })(time)
    this.taskList.unshift(fn)
    return this
  }
  next() {
    const fn = this.taskList.shift() // 控制消息先进先出
    fn && fn()
  }
}

function LazyMan(name) {
  return new LazyManClass(name)
}
LazyMan('Tony').eat('lunch').eat('dinner').sleep(4000).eat('junk food').sleepFirst(3000)
```

