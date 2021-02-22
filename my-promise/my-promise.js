//定义三种状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

function MyPromise(fn) {
  let self = this;
  self.value = null;
  self.error = null;
  self.status = PENDING;
  self.onFulfilled = null;
  self.onRejected = null;
  self.onFulfilledCallbacks = [];
  self.onRejectedCallbacks = [];

  self.onFulfilledCallbacks.forEach((callback) => callback(self.value));
  self.onRejectedCallbacks.forEach((callback) => callback(self.error));

  function resolve(value) {
    //如果状态是pending才去修改状态为fulfilled并执行成功逻辑
    if (self.status === PENDING) {
      setTimeout(function() {
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
      })
    }
  }

  function reject(error) {
    //如果状态是pending才去修改状态为rejected并执行失败逻辑
    if (self.status === PENDING) {
      setTimeout(function() {
        self.status = REJECTED;
        self.error = error;
        self.onRejected(self.error);
      })
    }
  }
  fn(resolve, reject);
}
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  if (this.status === PENDING) {
    this.onFulfilledCallbacks.push(onFulfilled);
    this.onRejectedCallbacks.push(onRejected);
  } else if (this.status === FULFILLED) {
    //如果状态是fulfilled，直接执行成功回调，并将成功值传入
    onFulfilled(this.value)
  } else {
    //如果状态是rejected，直接执行失败回调，并将失败原因传入
    onRejected(this.error)
  }
  return this;
}

// export default MyPromise;