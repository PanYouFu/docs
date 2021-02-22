const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

// promise 是一个包含then方法的对象或函数
// promise 有三个状态
// then 方法接收两个参数，onFulfilled,onRejected
// then 方法可以多次调用，onFulfilled,onRejected 组成一个对象，塞进callbacks数组，稍后依次执行

function MyPromise(fn) {
  const self = this;
  self.value = null;
  self.error = null;
  self.status = PENDING;
  self.onFulfilledCallbacks = [];
  self.onRejectedCallbacks = [];

  function resolve(value) {
    if (self.status === PENDING) {
      setTimeout(() => {
        self.status = FULFILLED;
        self.value = value;
        self.onFulfilledCallbacks.forEach((callback) => {
          if (typeof(callback) === 'Function') {
            callback(self.value)
          } else {
            console.log(typeof(callback))
            console.log('resolve-err')
          }
        });
      }, 0)
    }
  }

  function reject(error) {
    if (self.status === PENDING) {
      setTimeout(function() {
        self.status = REJECTED;
        self.error = error;
        self.onRejectedCallbacks.forEach((callback) => {
          if (typeof(callback) === 'Function') {
            callback(self.error)
          } else {
            console.log(typeof(callback))
            console.log('error-err')
          }
        });
      }, 0)
    }
  }
  fn(resolve, reject);
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
  if (this.status === PENDING) {
    this.onFulfilledCallbacks.push(onFulfilled);
    this.onRejectedCallbacks.push(onRejected);
  } else if (this.status === FULFILLED) {
    onFulfilled(this.value)
  } else {
    onRejected(this.error)
  }
  return this;
}
module.exports = MyPromise