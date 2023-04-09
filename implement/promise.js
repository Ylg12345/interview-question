
class myPromise {

  static PENDING = 'PENDING';
  static FULFILLED = 'FULFILLED';
  static REJECITED = 'REJECITED';

  constructor(func) {
    this.promiseState = myPromise.PENDING;
    this.promiseResult = null;
    this.onFulfilledCallbacks = []; 
    this.onRejectedCallbacks = []; 

    try {
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch(error) {
      this.reject(error);
    }
  }

  resolve(result) {
    if (this.promiseState === myPromise.PENDING) {
      this.promiseState = myPromise.FULFILLED;
      this.promiseResult = result;

      this.onFulfilledCallbacks.forEach(callback => {
        callback(result);
      })
    }
  }

  reject(result) {
    if (this.promiseState === myPromise.PENDING) {
      this.promiseState = myPromise.REJECITED;
      this.promiseResult = result;

      this.onRejectedCallbacks.forEach(callback => {
        callback(result);
      })
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
      throw reason;
    };

    if (this.promiseState === myPromise.PENDING) {
       this.onFulfilledCallbacks.push(() => {
        setTimeout(() => {
          onFulfilled(this.promiseResult);
        })
       });
       this.onRejectedCallbacks.push(() => {
        setTimeout(() => {
          onRejected(this.promiseResult);
        })
       });
      }
      

    if(this.promiseState === myPromise.FULFILLED) {
      setTimeout(() => {
        onFulfilled(this.promiseResult);
      })
    }

    if(this.promiseState === myPromise.REJECITED) {
      setTimeout(() => {
        onRejected(this.promiseResult);
      })
    }
  }
}

console.log(1);
let promise1 = new myPromise((resolve, reject) => {
  console.log(2);

  setTimeout(() => {
    resolve('这次一定');
    console.log(4);
  });
})
promise1.then(
  result => {
    console.log('fulfilled:', result);
  },
  reason => {
    console.log('rejected:', reason)
  }
)
console.log(3);

// function all(iterator) {
//   const type = Object.prototype.toString.call(iterator).slice(8, -1).toLocaleLowerCase();
//   const isIterable = (
//     ((typeof iterator === "object" && iterator !== null) ||
//       typeof iterator === "string") &&
//     typeof iterator[Symbol.iterator] === "function"
//   );

//   if(isIterable) {
//     const result = [];
//     let count = 0;
//     iterator = Array.from(iterator);
//     return new Promise((resolve, reject) => {
//       if(!iterator.length) {
//         resolve([])
//       }

//       for (let i = 0; i < iterator.length; i++) {
//         Promise.resolve(iterator[i]).then((res) => {
//           result[i] = res;
//           count++;
//           if (count === iterator.length) {
//             resolve(result);
//           }
//         }).catch(err => {
//           reject(err)
//         });
//       }
//     })
//   } else {
//     throw new TypeError(`${type} ${iterator} is not iterable`);
//   }
// }

// function race(iterator) {
//   return new Promise((resolve, reject) => {
//     for(let i = 0; i < iterator.length; i++) {
//       Promise.resolve(iterator[i]).then(res => {
//         resolve(res);
//       })
//     }
//   })
// }

// let p1 = new Promise((resove, reject) => {
//   setTimeout(() => {
//     resove(3);
//   }, 3000);
// });

// let p2 = new Promise((resove, reject) => {
//   setTimeout(() => {
//     resove(2);
//   }, 2000);
// });

// let p3 = new Promise((resove, reject) => {
//   setTimeout(() => {
//     reject('error');
//   }, 4000)
// });

// function* gen() {
//   yield 1;
//   yield 2;
//   yield 3;
// }

// all(gen()).then(res => {
//   console.log(res);
// });

// all([p1, p2]).then(res => {
//   console.log(res);
// });

// all([p1, p3]).then(res => {
//   console.log(res);
// });

// race([p1, p3]).then(res => {
//   console.log(res);
// });