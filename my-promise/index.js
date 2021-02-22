let fs = require("fs")

const b = 1

//定义三种状态
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

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
        self.onFulfilledCallbacks.forEach((callback) => callback(self.value));
      }, 0)
    }
  }

  function reject(error) {
    if (self.status === PENDING) {
      setTimeout(function() {
        self.status = REJECTED;
        self.error = error;
        self.onRejectedCallbacks.forEach((callback) => callback(self.error));
      }, 0)
    }
  }
  fn(resolve, reject);
}


function resolvePromise(bridgePromise, x, resolve, reject) {
  if (x instanceof MyPromise) {
    if (x.status === PENDING) {
      x.then(y => {
        resolvePromise(bridgePromise, y, resolve, reject);
      }, error => {
        reject(error);
      });
    } else {
      x.then(resolve, reject);
    }
  } else {
    resolve(x);
  }
}
MyPromise.prototype.then = function(onFulfilled, onRejected) {
  const self = this;
  let bridgePromise;
  // 防止使用者不传成功或失败回调函数，所以成功失败回调都给了默认回调函数
  onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value;
  onRejected = typeof onRejected === "function" ? onRejected : error => { throw error };
  if (self.status === FULFILLED) {
    return bridgePromise = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onFulfilled(self.value);
          resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    })
  }
  if (self.status === REJECTED) {
    return bridgePromise = new MyPromise((resolve, reject) => {
      setTimeout(() => {
        try {
          let x = onRejected(self.error);
          resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      }, 0);
    });
  }
  if (self.status === PENDING) {
    return bridgePromise = new MyPromise((resolve, reject) => {
      const value = self.value
      self.onFulfilledCallbacks.push((value) => {
        try {
          let x = onFulfilled(value);
          resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
      self.onRejectedCallbacks.push((error) => {
        try {
          let x = onRejected(error);
          resolvePromise(bridgePromise, x, resolve, reject);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}
MyPromise.prototype.catch = function(onRejected) {
  return this.then(null, onRejected);
}


let p = new MyPromise((resolve, reject) => {
  fs.readFile('./1.txt', "utf8", function(err, data) {
    err ? reject(err) : resolve(data)
  });
});
let f1 = function(data) {
  console.log('f1' + data);
  return new MyPromise((resolve, reject) => {
    fs.readFile('./2.txt', "utf8", function(err, data) {
        err ? reject(err) : resolve(data)
    });
  });
}
let f2 = function(data) {
  console.log('f2' + data)
  return new MyPromise((resolve, reject) => {
    fs.readFile('./3.txt', "utf8", function(err, data) {
      err ? reject(err) : resolve(data)
    });
  });
}
let f3 = function(data) {
  console.log('f3' + data);
}
let errorLog = function(error) {
  console.log(error)
}
p.then(f1).then(f2).then(f3).catch(errorLog)

