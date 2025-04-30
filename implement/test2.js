

function debounce(fn, wait) {
  let timer = null;

  return function (...args) {
    if (timer) {
      clearInterval(timer);
    }

    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, wait)
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

      if (canNow) fn.apply(this, args);
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
  const map = new Map();
  const result = [];

  for (let i = 0; i < arr.length; i++) {
    map.set(arr[i].id, { ...arr[i], children: [] });
  }

  for (const item of arr) {
    if (item.pid === 0) {
      result.push(map.get(item.id));
    } else {
      map.get(item.pid).children.push(map.get(item.id))
    }
  }

  return result;
}

function arrToTree1(arr) {

  const map = new Map();
  const result = [];

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

const tree = arrToTree1([
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
])

console.log('tree', tree);


function deepClone(target, weakMap = new WeakMap()) {
  if (target instanceof RegExp) return new RegExp(target);
  if (target instanceof Date) return new Date(target);
  if (target === null) return null;

  if (typeof target === 'object') {
    let cloneTarget;
    if (Array.isArray(target)) {
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
      callback.call(this, ...args);
    })
  }

  once(name, callback) {
    const wrapperFn = (...args) => {
      callback.call(this, ...args);
      this.off(name, wrapperFn);
    }

    wrapperFn.original = callback;

    this.on(name, wrapperFn);
  }
}

const eventEmiter = new EventEmitter();

const logArgs = (...args) => {
  console.log('args', ...args);
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


function all(iterator) {
  const isIterable = typeof iterator[Symbol.iterator] === 'function' && typeof iterator === 'string' || (typeof iterator === 'object' && iterator !== null);

  if (isIterable) {
    const result = [];
    let count = 0;

    const iteratorArr = Array.from(iterator);

    return new Promise((resolve, reject) => {
      if (!iteratorArr.length) {
        resolve([]);
      }


      for (let i = 0; i < iteratorArr.length; i++) {
        Promise.resolve(iteratorArr[i]).then((res) => {
          result[i] = res;
          count++;
          if (count === iteratorArr.length) {
            resolve(result);
          }
        }).catch(err => {
          reject(err)
        });
      }
    })
  } else {
    throw new TypeError();
  }
}

function race(iterable) {
  const isIterable = typeof iterable === 'object' && iterable !== null || typeof iterable === 'string' && typeof iterable[Symbol.iterator] === 'function';

  if (isIterable) {
    const iteratorArr = Array.from(iterable);
    return new Promise((resolve, reject) => {
      for (let i = 0; i < iteratorArr.length; i++) {
        Promise.resolve(iteratorArr[i])
          .then((res) => {
            resolve(res);
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

function limitAsyncRequest(iterable, limit) {
  const copyIterable = [...iterable];
  let index = 0;
  let active = 0;
  let resultCount = 0;
  const result = [];

  return new Promise((resolve, reject) => {
    function next() {
      while (active < limit && copyIterable.length > 0) {
        active++;
        ((i) => {
          const currentTask = copyIterable.shift();
          Promise.resolve(currentTask)
            .then((res) => {
              result[i] = res;
            })
            .catch((err) => {
              reject(err);
            })
            .finally(() => {
              active--;
              resultCount++;
              if (resultCount === iterable.length && active < limit) {
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

function limitAsyncRequestCopy(iterable, limit) {
  const results = [];
  const copyIterable = [...iterable];
  let active = 0;
  let index = 0;
  let resultCount = 0;

  return new Promise((resolve, reject) => {
    function next() {
      while (copyIterable.length > 0 && active < limit) {
        active++;

        // console.log('active111', active);

        ((i) => {
          const currentTask = copyIterable.shift();
          Promise.resolve(currentTask)
            .then((res) => {
              results[i] = res;
            })
            .catch((err) => {
              reject(err);
            })
            .finally(() => {
              resultCount++;
              active--;
              if (resultCount === iterable.length && active < limit) {
                resolve(results);
              } else {
                next();
              }
            })
        })(index++);
      }
    }

    next();
  })

}


limitAsyncRequestCopy([
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
//   console.log(res);
// });

all([p1, p1, p2]).then(res => {
  console.log(res);
});

// all([p1, p3]).then(res => {
//   console.log(res);
// });


// Promise.all([p1, p2]).then(res => {
//   console.log('Promise.all', res);
// });


// race([p1, p3]).then(res => {
//   console.log('race', res);
// });


// Promise.race([p1, p3]).then(res => {
//   console.log('Promise.race', res);
// });

function quickSort(arr) {

  if (arr.length <= 1) {
    return arr;
  }

  const middleIndex = Math.floor(arr.length / 2);
  const middleNum = arr[middleIndex];

  const leftArr = [];
  const rightArr = [];


  for (let i = 0; i < arr.length; i++) {
    if (i === middleIndex) {
      continue;
    }

    if (arr[i] < middleNum) {
      leftArr.push(arr[i])
    } else {
      rightArr.push(arr[i])
    }
  }

  return [...quickSort(leftArr), middleNum, ...quickSort(rightArr)];
}

console.log(quickSort([12, 43, 65, 22, 5, 132, 54, 21, 12, 9, 0, 178]));


function flattern(arr) {
  return arr.reduce((prev, cur) => {
    return prev.concat(Array.isArray(cur) ? flattern(cur) : cur);
  }, []);
}

console.log(flattern([1, 2, [3, [4]], 5]))

function compareVersion(v1, v2) {
  const v1Arr = v1.split('.').map((item) => Number(item));
  const v2Arr = v2.split('.').map((item) => Number(item));

  if (v1Arr.length < v2Arr.length) v1Arr.push(0);
  if (v1Arr.length > v2Arr.length) v2Arr.push(0);

  for (let i = 0; i < v1Arr.length; i++) {

    if (v1Arr[i] < v2Arr[i]) {
      return -1;
    }


    if (v1Arr[i] > v2Arr[i]) {
      return 1;
    }
  }

  return 0;
}

// console.log(compareVersion("0.20.7", "0.20.8") === -1);  // true
// console.log(compareVersion("0.20.9", "0.20.8") === 1);  // true
// console.log(compareVersion("0.20.08", "0.20.8") === 0);  // true
// console.log(compareVersion("0.20.08", "0.20.8.1") === -1); // true
// console.log(compareVersion("0.20.8.0", "0.20.8") === 0);  // true
// console.log(compareVersion("0.20.8.1", "0.20.8") === 1);  // true
// console.log(compareVersion("0.020", "0.20") === 0);


function toCamelKeys(target) {

  /**
   * 
   * @param {string} str 
   * @returns 
   */
  const toCamel = (str) => {
    return str.replace(/_([a-z])/g, (_, arg2) => {
      return arg2.toUpperCase();
    });
  }

  const result = {};
  for (const key in target) {
    const newKey = toCamel(key);
    if (typeof target[key] === 'object' && target !== null) {
      result[newKey] = toCamelKeys(target[key]);
    } else {
      result[newKey] = target[key]
    }
  }

  return result;
}

const obj1 = {
  a_b_c: {
    c_d_e: 1
  },
  f_k: 3
};

console.log(toCamelKeys(obj1));


const nodeA = { val: 'a', next: null };
const nodeB = { val: 'b', next: null };
const nodeC = { val: 'c', next: null };
const nodeD = { val: 'd', next: null };
const nodeE = { val: 'e', next: null };
const nodeF = { val: 'f', next: null };

nodeA.next = nodeB;
nodeB.next = nodeC;
nodeC.next = nodeD;
nodeD.next = nodeE;
nodeE.next = nodeF;

function centerNode(head) {
  let slow = head;
  let fast = head;

  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}

console.log(centerNode(nodeA))


function myNew(Fn, ...args) {
  if (typeof Fn !== 'function') {
    throw new Error('');
  }

  const obj = Object.create(Fn.prototype)

  const result = Fn.call(this, ...args);

  return typeof result === 'object' ? result : obj;
}


function Person(name) {
  this.name = name;
  this.sayName = function () {
    console.log("name", this.name);
  };
  return {
    name: "maomao",
    sayName: function () {
      console.log("name", this.name);
    }
  };
}
const person = myNew(Person, "ayetongzhi");
console.log("person", person);
person.sayName();

const person1 = new Person('ayetongzhi');

console.log(person.__proto__ === Person.prototype);
console.log(person1.__proto__ === Person.prototype)


function myInstanceof(target, origin) {

  while (target) {

    if (target.__proto__ === origin.prototype) {
      return true;
    }

    target = target.__proto__;
  }

  return false;
}

console.log('myInstanceof', myInstanceof({}, Array));

Function.prototype.myApply = function (context, args) {

  if (typeof this !== 'function') {
    throw new Error('');
  }

  if (!context || context === null) {
    context = window;
  }

  const fn = Symbol();
  let result = null;

  context[fn] = this;
  result = context[fn](...args);
  delete context[fn];

  return result;
}


Function.prototype.myBind = function (context, ...args) {
  if (!context) {
    context = window;
  }

  let _this = this;
  const fn = Symbol();
  context[fn] = this;

  const result = function (...innerArgs) {
    if (this instanceof _this) {
      this[fn] = _this;
      this[fn](...args.concat(innerArgs));
      delete this[fn];
    } else {
      context[fn](...args.concat(innerArgs));
      delete context[fn];
    }
  }

  function Fnop() { }
  // 通过空函数隔离原型链
  Fnop.prototype = this.prototype;
  result.prototype = new Fnop();

  return result;
}

// function printMessage(message) {
//   console.log('this', this);
//   console.log(this.name + ':'+ message);
// }

// const person2 = { name: 'Alice' };

// const boundFunction = printMessage.myBind(null, 'Hello');

// boundFunction();

function Test(name) {
  this.name = name;
}

Test.prototype.sayHello = function () {
  console.log(`Hello, ${this.name}`);
};

// 使用 myBind 创建闭包函数
const BoundTest = Test.myBind(null, "Alice");
const instance = new BoundTest();


// 初始调用正常
instance.sayHello();

// 修改原函数原型
Test.prototype.sayGoodbye = function () {
  console.log(`Goodbye, ${this.name}`);
};

console.log('instance', instance);


instance.sayGoodbye();


class Scheduler {
  constructor({ limit }) {
    this.limit = limit;
    this.list = [];
    this.active = 0;
  }

  start() {
    for (let i = 0; i < this.limit; i++) {
      this.run();
    }
  }

  add(delay, order) {
    const promiseFunc = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('order', order);
          resolve();
        }, [delay])
      })
    }

    this.list.push(promiseFunc);
  }


  run() {
    if (this.active >= this.limit || !this.list.length) return;

    this.active++;
    const task = this.list.shift();
    task().finally(() => {
      this.active--;
      this.run(); // 递归触发下一个任务
    });
  }
}

const timeout = (time) => new Promise(resolve => {
  setTimeout(resolve, time)
})

const scheduler = new Scheduler({ limit: 2 })
const addTask = (delay, order) => scheduler.add(delay, order);


addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')

scheduler.start();

function renderTemplate(template, data) {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    console.log('match', match);
    console.log('key', key);
    return data[key] || match;
  })
}

const template = "My name is {{name}} and I'm {{age}} years old.";
const data = {
  name: 'Alice',
  age: 25
};
const result = renderTemplate(template, data);
console.log(result);



/**
 * 
 * @param {string} str
 * @returns {boolean} 
 */
function breakingMathing(str) {


  function isMathing(left, right) {
    if (left === '(' && right === ')') return true;
    if (left === '{' && right === '}') return true;
    if (left === '[' && right === ']') return true;
    return false;
  }


  const stack = [];
  const left = '{([';
  const right = '})]';

  for (let i = 0; i < str.length; i++) {
    if (left.includes(str[i])) {
      stack.push(str[i]);
    } else if (right.includes(str[i])) {
      const isMath = isMathing(stack[stack.length - 1], str[i]);
      if (isMath) {
        stack.pop();
      } else {
        stack.push(str[i]);
      }
    }
  }

  if (stack.length === 0) {
    return true;
  }

  return false;
}


console.log('breakingMathing', breakingMathing('({{}})'))


class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

const root = new TreeNode(1);
root.left = new TreeNode(2);
root.left.left = new TreeNode(4);
root.left.right = new TreeNode(5);
root.right = new TreeNode(3);
root.right.right = new TreeNode(6);

console.log(root);
console.log(levealOrderCopy(root));
console.log(preorderTraversal(root));
console.log(postorderTraversal(root));
console.log(inorderTraversal(root));


function levelOrder(root) {
  if (!root) return [];

  const queue = [root];
  const result = [];
  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevel = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      currentLevel.push(node.value);

      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(currentLevel);
  }

  return result;
}


function levealOrderCopy(root) {
  const stack = [root];
  const result = [];
  while (stack.length > 0) {

    const currentLevel = [];
    const levelSize = stack.length;

    for (let i = 0; i < levelSize; i++) {
      const node = stack.shift();
      currentLevel.push(node.value);

      if (node.left) stack.push(node.left)
      if (node.right) stack.push(node.right)
      
    }
    result.push(currentLevel)
  }

  return result;
}

function preorderTraversal(root) {
  const stack = [root];
  const result = [];

  while(stack.length > 0) {
    const node = stack.pop();
    result.push(node.value);

    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }

  return result;
}


function postorderTraversal(root) {
  const stack = [root];
  const result = [];

  while(stack.length > 0) {
    const node = stack.pop();
    result.unshift(node.value);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }

  return result;
}

function inorderTraversal(root) {
  const result = [];
  const stack = [];

  let cur = root;

  while(cur || stack.length > 0) {
    while (cur) {
      stack.push(cur);
      cur = cur.left;
    }

    cur = stack.pop();
    console.log('cur', cur);
    result.push(cur.value);
    cur = cur.right;
  }

  return result;
}


function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }
}

function sum(a, b, c) {
  return a + b + c;
}

let curriedSum = curry(sum);

console.log(curriedSum(1)(2)(3));
console.log(curriedSum(1, 2)(3));
console.log(curriedSum(1, 2, 3));

/**
 * 
 * @param {string} s 
 * @returns 
 */
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


/**
 * 
 * @param {string} a 
 * @param {string} b 
 */
function bigSum(a, b) {
  const len = Math.max(a.length, b.length);
  a = a.padStart(len, '0');
  b = b.padStart(len, '0');

  let cur = 0;
  let result = '';

  for(i = len - 1; i >=0; i--) {
    const n = Number(a[i]) + Number(b[i]) + cur;
    cur = Math.floor(n / 10);
    result = (n % 10) + result;
  }

  if (cur) {
    result = '1' + result;
  }

  return result;
}

console.log(bigSum('1347911', '918722'));
