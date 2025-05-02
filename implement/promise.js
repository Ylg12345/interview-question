class myPromise {
  static PENDING = 'PENDING';
  static FULFILLED = 'FULFILLED';
  static REJECTED = 'REJECTED';

  constructor(executor) {
    this.status = myPromise.PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = []; 
    this.onRejectedCallbacks = []; 

    let resolve = (result) => {
      if (this.status === copyMyPromise.PENDING) {
        this.status = copyMyPromise.FULFILLED;
        this.promiseResult = result;
        this.onFulfilledCallbacks((callback) => {
          callback(result);
        })
      }
    }
  
    let reject = (reason) => {
      if (this.status === copyMyPromise.PENDING) {
        this.status = copyMyPromise.REJECTED;
        this.promiseResult = reason;
        this.onRejectedCallbacks((callback) => {
          callback(reason);
        })
      }
    }

    try {
      executor(resolve, reject);
    } catch(error) {
      this.reject(error);
    }
  }

  /**
   * [注册fulfilled状态/rejected状态对应的回调函数] 
   * @param {function} onFulfilled  fulfilled状态时 执行的函数
   * @param {function} onRejected  rejected状态时 执行的函数 
   * @returns {function} newPromsie  返回一个新的promise对象
   */

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };
    const promise2 = new myPromise((resolve, reject) => {
      if(this.status === myPromise.FULFILLED) {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
      } else if(this.status === myPromise.REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        })
      } else if(this.status === myPromise.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          })
        });
        this.onRejectedCallbacks.push((reason) => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          })
        });
      }
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(undefined, onRejected)
  }

  finally(callBack) {
    return this.then(
      value => myPromise.resolve(callBack()).then(() => value),
      reason => myPromise.resolve(callBack()).then(() => { throw reason; })
    );
  }

  /**
   * @param {[type]} value 要解析为 Promise 对象的值 
   */
  static resolve(value) {
    if(value instanceof myPromise) {
      return value;
    } else if(value instanceof Object && 'then' in value) {
      return new myPromise((resolve, reject) => {
        value.then(resolve, reject);
      })
    }

    return new myPromise((resolve) => {
      resolve(value);
    })
  }

  static reject(reason) {
    return new myPromise((resolve, reject) => {
      reject(reason);
    })
  }

  static all(iterator) {
    const isIterable = iterableCheck(iterator);
    if(isIterable) {
      const result = [];
      let count = 0;
      iterator = Array.from(iterator);
      return new myPromise((resolve, reject) => {
        if(!iterator.length) {
          resolve([])
        }
  
        for (let i = 0; i < iterator.length; i++) {
          myPromise.resolve(iterator[i]).then((res) => {
            result[i] = res;
            count++;
            if (count === iterator.length) {
              resolve(result);
            }
          }).catch(err => {
            reject(err)
          });
        }
      })
    } else {
      throw new TypeError('Argument is not iterable');
    }
  }

  static race(iterator) {
    const isIterable = iterableCheck(iterator);
    if(isIterable) {
      return new myPromise((resolve, reject) => {
        for(let i = 0; i < iterator.length; i++) {
          myPromise.resolve(iterator[i]).then(res => {
            resolve(res);
          })
        }
      })
    } else {
      throw new TypeError('Argument is not iterable');
    }
  }
}

function iterableCheck(iterator) {
  const type = Object.prototype.toString.call(iterator).slice(8, -1).toLocaleLowerCase();
  const isIterable = (
    ((typeof iterator === "object" && iterator !== null) ||
      typeof iterator === "string") &&
    typeof iterator[Symbol.iterator] === "function"
  );

  return isIterable;
}

/**
 * 对 resolve()、reject() 进行改造增强 针对 resolve() 和 reject() 中不同值情况 进行处理
 * @param  {promise} promise2 promise1.then 方法返回的新的 promise 对象
 * @param  {[type]} x         promise1 中 onFulfilled 或 onRejected 的返回值
 * @param  {[type]} resolve   promise2 的 resolve 方法
 * @param  {[type]} reject    promise2 的 reject 方法
 */
function resolvePromise(promise2, x, resolve, reject) {
  if(x === promise2) {
    throw new TypeError('Chaining cycle detected for promise');
  }

  if(x instanceof myPromise) {
    x.then(
      y => {
      resolvePromise(promise2, y, resolve, reject);
      },
      reject
    );
  } else if(x !== null && ((typeof x === 'object' || (typeof x === 'function')))) {
    let then;
    try {
      then = x.then;
    } catch(error) {
      return reject(error);
    }

    if(typeof then === 'function') {
      let called = false;
      try {
        then.call(
            x,
            y => {
                if (called) return;
                called = true;
                resolvePromise(promise2, y, resolve, reject);
            },
            r => {
                if (called) return;
                called = true;
                reject(r);
            }
        )
      } catch (error) {
        if (called) return;
        called = true;
        reject(error);
      }
    } else {
      resolve(x);
    }
  } else {
    return resolve(x);
  }
}

myPromise.deferred = function() {
  let result = {};

  result.promise = new myPromise((resolve, reject) => {
    result.resolve = resolve;
    result.reject = reject;
  })

  return result;
}

// module.exports = myPromise;


let p5 = new myPromise((resove, reject) => {
  setTimeout(() => {
    resove(3);
  }, 5000);
});

let p4 = new myPromise((resove, reject) => {
  setTimeout(() => {
    resove(2);
  }, 2000);
});

let p3 = new myPromise((resove, reject) => {
  setTimeout(() => {
    reject('error');
  }, 4000)
});


myPromise.all([p5, p4, p4, p3]).then(res => {
  console.log('myPromise res', res);
}).catch((err) => {
  console.log('err', err)
});
