class copyMyPromise {
  
  static PENDING = 'PENDING';
  static FULFILLED = 'FULFILLED';
  static REJECTED = 'REJECTED';

  constructor(executor) {
    this.promiseState = copyMyPromise.PENDING;
    this.promiseResult = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch(err) {
      this.reject(error);
    }

  }

  resolve(result) {
    if (this.promiseState === copyMyPromise.PENDING) {
      this.promiseState = copyMyPromise.FULFILLED;
      this.promiseResult = result;
      this.onFulfilledCallbacks((callback) => {
        callback(result);
      })
    }
  }

  reject(reason) {
    if (this.promiseState === copyMyPromise.PENDING) {
      this.promiseState = copyMyPromise.REJECTED;
      this.promiseResult = reason;
      this.onRejectedCallbacks((callback) => {
        callback(reason);
      })
    }
  }

  /**
   * 
   * @param {Function} onFulfilled 
   * @param {Function} onRejected 
   */
  then(onFulfilled, onRejected) {
    const promise2 = new copyMyPromise((resolve, reject) => {

    })
  }

  catch(onRejected) {
    this.then(undefined, onRejected);
  }

  finally(callBack) {
    this.then(callBack, callBack);
  }
}
