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

function permute(s) {
  if (s.length === 1) {
      return [s];
  }
  let result = [];
  for (let i = 0; i < s.length; i++) {
      let char = s[i];
      let remainingChars = s.slice(0, i) + s.slice(i + 1);
      let subPermutations = permute(remainingChars);
      for (let perm of subPermutations) {
          result.push(char + perm);
      }
  }
  return result;
}

let s = "abc";
console.log(permute(s));
