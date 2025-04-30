function debounce(fn, wait) {
  let timer = null;

  return function (...args) {
    if (timer) clearInterval(timer)
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, wait);
  }
}

function immediateDebounce(fn, wait, immediate) {
  let timer = null;

  return function (...args) {
    if (timer) clearInterval(timer);

    if (immediate) {
      const canNow = !timer;
      timer = setTimeout(() => {
        timer = null;
      }, wait);

      if (canNow) {
        fn.apply(this, args);
      }
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args);
        timer = null;
      }, wait);
    }
  }
}

function throttle(fn, wait) {
  let timer = null;
  return function (...args) {
    if (timer) return;

    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, wait);
  }
}



const span = document.querySelector('.name');
const input = document.querySelector('.input');

function changeName(e) {
  span.innerHTML = e.target.value;
};

const _changeName = immediateDebounce(changeName, 1000, true);

input.onkeyup = _changeName;

const _resize = throttle(() => {
  console.log(2222);
}, 1000);
window.addEventListener('resize', () => {
  _resize();
});

function arrToTree(arr) {

  const result = [];
  const map = new Map();

  for (const item of arr) {
    map.set(item.id, { ...item, children: [] });
  }

  for (const item of arr) {
    if (item.pid === 0) {
      result.push(map.get(item.id));
    } else {
      map.get(item.pid).children.push(map.get(item.id));
    }
  }

  return result;
}

function treeToArr(tree) {
  const result = [];
  const queue = [...tree];
  while (queue.length > 0) {
    const { children, ...rest } = queue.shift();
    result.push(rest);

    if (children.length > 0) {
      queue.push(...children);
    }
  }

  return result;
}


const tree = arrToTree([
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
])

const arr = treeToArr(tree);

console.log('tree', tree);
console.log('arr', arr);

function deepClone(target, weakMap = new WeakMap) {
  if (typeof target === Date) return new Date(target);
  if (typeof target === RegExp) return new RegExp(target);
  if (target === null) return null;

  let cloneTarget;
  if (typeof target === 'object') {
    if (target instanceof Array) {
      cloneTarget = [];
    } else {
      cloneTarget = {};
    }

    if (weakMap.get(target)) {
      return weakMap.get(target);
    }


    weakMap.set(target, cloneTarget);

    for (const key in target) {
      cloneTarget[key] = deepClone(target[key], weakMap);
    }

    return cloneTarget;
  } else {
    return target;
  }
}

const obj = {
  name: 'ylg',
  career: 'Front End',
  love: ['apple', 'orange'],
  a: {
    b: [1, 2, 3],
    c: {
      d: 1
    }
  },
  e: function () {
    console.log(this.name);
  },
  g: new Date(),
  h: new RegExp(),
  i: null
}

obj.a.c.f = obj.a;
obj.a.c.j = obj.a.c;

console.log(deepClone(obj));


class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(name, callback) {
    const callbacks = this.events[name] || [];
    callbacks.push(callback);
    this.events[name] = callbacks;
  }

  off(name, callback) {
    const callbacks = this.events[name] || [];
    const newCallbacks = callbacks.filter((_callback) => _callback !== callback && _callback.original !== callback);
    this.events[name] = newCallbacks;
  }

  emit(name, ...args) {
    const callbacks = this.events[name] || [];
    callbacks.forEach((callback) => {
      callback.apply(this, args);
    })
  }

  once(name, callback) {
    const wrapperFn = (...args) => {
      callback.apply(this, args);
      this.off(name, wrapperFn);
    }

    wrapperFn.original = callback;
    this.on(name, wrapperFn);
  }
}

const eventEmiter = new EventEmitter();


const logArgs = (...args) => {
  console.log('1111', ...args);
};

eventEmiter.on('test', logArgs);

eventEmiter.emit('test', 2, 3);

eventEmiter.emit('test', [2, 3]);

eventEmiter.emit('test', { username: '456' });


eventEmiter.once('hello', (...args) => {
  console.log('once', ...args);
});

eventEmiter.emit('hello', 1, 33);
eventEmiter.emit('hello', 22, 55);

function all(iterable) {
  const isIterable = typeof iterable[Symbol.iterator] === 'function' && typeof iterable === 'string' || (typeof iterable === 'object' && iterable !== null);
  const result = [];
  let count = 0;

  if (isIterable) {

    iterable = Array.from(iterable);
    return new Promise((resolve, reject) => {

      if (iterable.length === 0) {
        resolve([]);
      }

      for (let i = 0; i < iterable.length; i++) {
        const task = iterable[i];
        Promise.resolve(task)
          .then((res) => {

            result[i] = res;
            count++;

            if (count === iterable.length) {
              resolve(result);
            }
          })
          .catch(err => {
            reject(err);
          })
      }
    })
  } else {
    throw new TypeError();
  }
}


function race(iterable) {
  const isIterable = typeof iterable[Symbol.iterator] === 'function' && typeof iterable === 'string' || (typeof iterable === 'object' && iterable !== null);

  if (isIterable) {
    iterable = Array.from(iterable);
    return new Promise((resolve, reject) => {
      for (let i = 0; i < iterable.length; i++) {
        Promise.resolve(iterable[i])
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          })
      }
    })
  }
}

let p1 = new Promise((resove, reject) => {
  setTimeout(() => {
    resove(3);
  }, 5000);
});

let p2 = new Promise((resove, reject) => {
  setTimeout(() => {
    resove(2);
  }, 2000);
});

let p3 = new Promise((resove, reject) => {
  setTimeout(() => {
    reject('error');
  }, 4000)
});

function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

// all(gen()).then(res => {
//   console.log('gen', res);
// });

// all([p1, p1, p2]).then(res => {
//   console.log('p1, p1, p2', res);
// });

// all([p1, p3]).then(res => {
//   console.log('p1, p3', res);
// });


// Promise.all([p1, p2]).then(res => {
//   console.log('Promise.all', res);
// });


race([p1, p2]).then(res => {
  console.log('race', res);
});


Promise.race([p1, p3]).then(res => {
  console.log('Promise.race', res);
});


function limitAsyncRequest(arr, limit) {
  return new Promise((resolve, reject) => {
    let activeCount = 0;
    let index = 0;
    let resultCount = 0;
    const result = [];
    const copyArr = [...arr];

    function next() {
      while (copyArr.length > 0 && activeCount < limit) {
        activeCount++;

        ((i) => {
          const task = copyArr.shift();
          Promise.resolve((task))
            .then((res) => {
              result[i] = res;
            })
            .catch((err) => {
              reject(err);
            })
            .finally(() => {
              activeCount--;
              resultCount++;

              if (resultCount === arr.length) {
                resolve(result);
              } else {
                next();
              }
            })
        })(index++)
      }
    }


    next();

  })
}


limitAsyncRequest([
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(3);
    }, 300)
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, 200)
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(6);
    }, 600)
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(5);
    }, 500)
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(2);
    }, 200)
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(6);
    }, 600)
  }),
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(5);
    }, 500)
  }),
], 3).then((res) => {
  console.log('res', res);
});


class Scheduler {
  constructor({ limit }) {
    this.limit = limit;
    this.activeCount = 0;
    this.queue = [];
  }


  add(delay, order) {
    const promiseFunc = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(order)
          resolve();
        }, delay)
      })
    }

    this.queue.push(promiseFunc);

  }

  start() {
    for (let i = 0; i < this.limit; i++) {
      this.run();
    }
  }

  run() {
    if (this.activeCount > this.limit || !this.queue.length) return;

    this.activeCount++;
    const task = this.queue.shift();

    task()
      .finally(() => {
        this.activeCount--;
        this.run();
      })
  }
}

const scheduler = new Scheduler({ limit: 2 })
const addTask = (delay, order) => scheduler.add(delay, order);


addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')

scheduler.start();

/**
 * 
 * @param {string} s 
 */
function permute(s) {
  if (s.length === 1) {
    return [s];
  }

  let result = [];

  for(let i = 0; i < s.length; i++) {
    const char = s[i];
    const remainingChars = s.slice(0, i) + s.slice(i + 1);
    const subPermutations = permute(remainingChars);

    for(const item of subPermutations) {
      result.push(char + item);
    }
  }

  return result;
}

let s = "abcde";
console.log(permute(s));

/**
 * 
 * @param {string} a 
 * @param {string} b 
 */
function bigSum(a, b) {
  const len  = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');

  let cur = 0;
  let result = '';

  for(let i = len - 1; i >=0 ; i--) {
    const n = Number(a[i]) + Number(b[i]) + cur;
    cur = Math.floor(n / 10);
    result = (n % 10) + result;
  }

  if (cur) {
    result = '1' + result;
  }

  return result;
}


console.log(bigSum('2432', '32'));

/**
 * 
 * @param {string} num1 
 * @param {string} num2 
 */
function multiply(num1, num2) {
  if (num1 == "0" || num2 == "0") return "0";

  let arr = [];

  // ​​逐位相乘
  for(i = num1.length - 1; i >=0; i--) {
    for(j = num2.length - 1; j >=0; j--) {
      arr[i + j] = (arr[i + j] || 0) + num1[i] * num2[j];
    }
  }

  // ​​进位处理​​
  let carry = 0;
  for(let i = arr.length - 1; i >=0; i--) {
    let cur = arr[i] + carry;
    arr[i] = cur % 10;
    carry = Math.floor(cur / 10);
  }

  if (carry) {
    arr.unshift(carry)
  }

  return arr.join('');
}

console.log('multiply', multiply('2500', '4'))

/**
 * 
 * @param {string} a 
 */
function lengthOfLongestSubstring (s) {
  let left = 0;
  let right = 0;
  let maxLen = 0;
  const map = new Map();

  while(right < s.length) {
    const letter = s[right];
    if (map.has(letter)) {
      const lastPos = map.get(letter);
      // left = lastPos +　1;
      // 强制左指针单向移动
      left = Math.max(left, lastPos + 1);
    }

    map.set(letter, right);
    maxLen = Math.max(maxLen, right - left + 1);
    right++;
  }

  return maxLen;
}

console.log('lengthOfLongestSubstring', lengthOfLongestSubstring('abcdabcbb'))
