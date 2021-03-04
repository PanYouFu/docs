// 新增一个lazyMan类，类中包含eat、sleep、sleepFirst
// 需要方法在前一个方法结束后才能执行，设计方法队列先进先出。
// 在链式调用（同步方法）走到最后一步时，得到一个方法队列，顺序为，该链的顺序。
// 使用setTimeOut 将这些方法，防止异步消息队列中
// 同步方法结束后。栈清空，查找消息队列，宏任务settimeout开始执行。
// 通过next方法不断调用队列里的下一个方法
// 每次执行栈中只有一个方法，故即使这个方法是异步的，也不会影响后面方法的执行

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
    const fn = this.taskList.shift()
    fn && fn()
  }
}

function LazyMan(name) {
  return new LazyManClass(name)
}
LazyMan('Tony').eat('lunch').eat('dinner').sleep(4000).eat('junk food').sleepFirst(3000)