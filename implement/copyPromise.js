class copyMyPromise {
  
  static PENDING = 'PENDING';
  static FULFILLED = 'FULFILLED';
  static REJECTED = 'REJECTED';

  constructor(executor) {
    this.status = copyMyPromise.PENDING;
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
    } catch(err) {
      this.reject(error);
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
