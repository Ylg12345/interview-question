/**
 * 
 * @param {Function} func 
 * @param {number} wait 
 * @returns 
 */
function throttle(func, wait) {
  let timer = null;
  return function (...args) {
    if (timer) return;

    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, wait);
  }
}

/**
 * 
 * @param {Function} func 
 * @param {number} wait 
 */
function debounce(func, wait) {
  let timer = null;
  return function (...args) {
    if (timer) clearInterval(timer);

    timer = setTimeout(() => {
      func.apply(this, args);
      timer = null;
    }, wait);
  }
}


const span = document.querySelector('.name');
const input = document.querySelector('.input');

function changeName (e) {
  span.innerHTML = e.target.value;
};

const _changeName = debounce(changeName, 1000, true);

input.onkeyup = _changeName;

const _resize = throttle(() => {
  console.log(2222);
}, 1000);
window.addEventListener('resize', () => {
  _resize();
});

let arr = [
  {id: 1, name: '部门1', pid: 0},
  {id: 2, name: '部门2', pid: 1},
  {id: 3, name: '部门3', pid: 1},
  {id: 4, name: '部门4', pid: 3},
  {id: 5, name: '部门5', pid: 4},
];


function arrToTree(arr) {
  const map = new Map();
  const result = [];

  for(item of arr) {
    map.set(item.id, { ...item, children: [] });
  }

  for(item of arr) {
    if (item.pid === 0) {
      result.push(map.get(item.id));
    } else {
      map.get(item.pid).children.push(map.get(item.id));
    }
  }

  return result;
}

console.log(arrToTree(arr));

function deepClone(target, weakMap = new WeakMap()) {
  if (target === null) return target;
  if (target instanceof RegExp) return new RegExp(target);
  if (target instanceof Date) return new Date(target);

  if (typeof target === 'object') {
    let cloneTarget = {};
    if (weakMap.get(target)) {
      return weakMap.get(target);
    }

    console.log('weakMap', weakMap);
  
    weakMap.set(target, cloneTarget);
    for(const key in target) {
      cloneTarget[key] = deepClone(target[key], weakMap);
    };
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
  e: function() {
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

  on (name, callback) {
    const callbacks = this.events[name] || [];
    callbacks.push(callback);
    this.events[name] = callbacks;
  }

  emit (name, ...args) {
    const callbacks = this.events[name] || [];
    callbacks.forEach((callback) => {
      callback(args);
    });
  }

  off (name, callback) {
    const callbacks = this.events[name] || [];
    const newCallbacks = callbacks.filter((_callback) => _callback !== callback);
    this.events[name] = newCallbacks;
  }

  once(name, fn) {
    const wrapperFn = (...args) => {
      fn.apply(this, args);
      this.off(name, wrapperFn);
    }

    this.on(name, wrapperFn);
  }
}

const eventEmiter = new EventEmitter();

const logArgs = (args) => {
  console.log('args', ...args);
};

const logArgs1 = (args) => {
  console.log('args1', ...args);
}

eventEmiter.on('test', logArgs);

eventEmiter.on('test', logArgs1);

eventEmiter.emit('test', 1);

eventEmiter.off('test', logArgs);

eventEmiter.emit('test', 2);

eventEmiter.once('hello', (args) => {
  console.log('once', ...args);
});

eventEmiter.emit('hello', 1);
eventEmiter.emit('hello', 22);

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
  let slow = head, fast = head;
  while (fast &&　fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }

  return slow;
}

console.log(centerNode(nodeA));

function toCamelKeys(target) {
  const toCamel = (str) => {
    return str.replace(/_([a-z])/g, (_, arg2) => {
      return arg2.toUpperCase();
    });
  }

  const result = {};
  for(const key in target) {
    const newKey = toCamel(key);
    if (typeof target[key] === 'object' && target !== null) {
      result[newKey] = toCamelKeys(target[key]);
    } else {
      result[newKey] = target[key];
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


function myNew(Func, ...args) {
  if (typeof Func !== 'function') {
    console.error('');
    return;
  }

  const obj = {};

  obj.__proto__ = Func.prototype;
  const result = Func.apply(obj, args);
  return typeof result === 'object' ? result : obj;
}

function myInstanceof(origin, target) {
  while (target) {
    if (target.__proto__ === origin.prototype) {
      return true;
    }
    target = target.__proto__;
  }

  return false;
}


// 给定一个字符串数组，将字母异位词组合在一起。字母异位词指字母相同，但排列不同的字符串。
// 示例:
// 输入: ["eat", "tea", "tan", "ate", "nat", "bat"],
// 输出:
// [ 
//   ["ate","eat","tea"],
//   ["nat","tan"],
//   ["bat"]
// ]

const strs = ["eat", "tea", "tan", "ate", "nat", "bat"];

function groupWords(strs) {
  const map = new Map();
  strs.forEach((str) => {
    const newStr = str.split('').sort().join('');
    if (map.has(newStr)) {
      map.get(newStr).push(str);
    } else {
      map.set(newStr, [str]);
    }
  });
  return Array.from(map.values());
}

console.log(groupWords(strs));

function multiCategoriesSpread(categories) {
  const result = [];

  function getCategory(arr, restValues = '') {
    if (arr.length === 0) {
      result.push(restValues);
      return;
    }
    
    const curCategory = arr[0];
    curCategory.forEach((item) => {
      getCategory(arr.slice(1), `${restValues}${restValues ? '-' : ''}${item}`);
    });
  }

  getCategory(categories);

  return result;
}


const categories = [['a1', 'a2'], ['b1', 'b2'], ['c1', 'c2', 'c3']];

const results = multiCategoriesSpread(categories);
console.log(results);

Function.prototype.myCall = function(context, ...args) {
  if (typeof this !== 'function') {
    throw new Error('');
  }

  if (!context &&　context === null) {
    context = window;
  }

  console.log('context', context);

  let result = null;
  context['func'] = this;
  result = context['func']([...args]);
  delete context['func'];
  return result;
}

function consoleName() {
  console.log(this.name);
}

let o = {
  name: 'ylg',
}

consoleName.myCall(o);

Function.prototype.myBind = function(context, ...args) {
  if (!context && context === null) {
    context = window;
  }

  let fn = Symbol();
  let _this = this;
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

  result.prototype = Object.create(this.prototype);
  return result;
}

function printMessage(message) {
  console.log(this.name + ':'+ message);
}

const person = { name: 'Alice' };

// 使用 myBind 函数
const boundFunction = printMessage.myBind(person, 'Hello');

// 调用绑定后的函数
boundFunction();


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

console.log(levelOrder(root));
console.log(preorderTraversal(root));

// 根节点开始，并沿着树的每一层逐个访问节点。在遍历每一层时，我们按照从左到右的顺序访问节点。这意味着我们会先访问左子树，然后再访问右子树。
// BFS 算法使用队列来实现。我们将根节点入队，然后从队列中弹出第一个节点，并访问它的左右子节点，然后将这些子节点入队。我们一直重复这个过程，直到队列为空。
// 时间复杂度和空间复杂度都为 O(n)

function levelOrder(root) {
  if (!root) return [];

  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const level = queue.length;
    const curLevel = [];
    for (let i = 0; i < level; i++) {
      const node = queue.shift();
      curLevel.push(node.value);
  
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(curLevel);
  }
  return result;
}

// function preorderTraversal(root) {
//   if (!root) return [];

//   const result = [];
//   const stack = [root];
//   while (stack.length > 0) {
//     const node = stack.pop();
//     result.push(node.value);

//     if (node.right) stack.push(node.right);
//     if (node.left) stack.push(node.left);
//   }

//   return result;
// }

function preorderTraversal(root) {
  if (!root) {
    return [];
  }

  const result = [];

  function traverse(node) {
    if (node === null) {
      return;
    }

    result.push(node.value);
    traverse(node.left);
    traverse(node.right);
  }

  traverse(root);

  return result;
}


// 寄生组合式继承

function SuperType(name) {
  this.name = name;
  this.colors = ["red","yellow","bule"];
}

SuperType.prototype.sayName = function() {
  console.log(this.name)
}

function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}

SubType.prototype = Object.create(SuperType.prototype);
SubType.prototype.constructor = SubType;

SubType.prototype.sayAge = function(){
    console.log(this.age);
}

const subType = new SubType('ylg', 23);

console.log('subType', subType);


function all(iterator) {
  const isIterable = typeof iterator === 'object' &&　iterator !== null || 
  typeof iterator === 'string' ||
  typeof iterator === 'function';
  if (isIterable) {
    let count = 0;
    const result = [];
    const iteratorArr = Array.from(iterator);
    
    return new Promise((resolve, reject) => {
      if (iteratorArr.length === 0) {
        resolve([]);
      }
      for(const item of iteratorArr) {
        Promise.resolve(item).then((res) => {
          result.push(res);
          count++;
          if (count === iteratorArr.length) {
            resolve(result);
          }
        }).catch(err => {
          reject(err);
        })
      }
    })

  } else {
    throw new Error();
  }
}


function race(iterable) {
  const iteratorArr = Array.from(iterable);
  return new Promise((resolve, reject) => {
    for(const item of iteratorArr) {
      Promise.resolve(item).then((res) => {
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    }
  })
}

function compareVersion(v1, v2) {
  const v1Arr = v1.split('.').map((item) => Number(item));
  const v2Arr = v2.split('.').map((item) => Number(item));

  while (v1Arr.length > v2Arr.length) v2Arr.push(0);
  while (v1Arr.length < v2Arr.length) v1Arr.push(0);

  for(let i = 0; i < v1Arr.length; i++) {
    if (v1Arr[i] > v2Arr[i]) {
      return 1;
    }

    if (v1Arr[i] < v2Arr[i]) {
      return -1;
    }
  }

  return 0;
}

console.log(compareVersion("0.20.7", "0.20.8") === -1);  // true
console.log(compareVersion("0.20.9", "0.20.8") === 1);  // true
console.log(compareVersion("0.20.08", "0.20.8") === 0);  // true
console.log(compareVersion("0.20.08", "0.20.8.1") === -1); // true
console.log(compareVersion("0.20.8.0", "0.20.8") === 0);  // true
console.log(compareVersion("0.20.8.1", "0.20.8") === 1);  // true
console.log(compareVersion("0.020", "0.20") === 0);

function limitAsyncRequest(iterator, limit) {
  return new Promise((resolve, reject) => {
    let active = 0;
    let results = [];
    let index = 0;
    function next() {
      if (index >= iterator.length || active >= limit) return;
      active++;
      const promise = iterator[index++];
      Promise.resolve(promise).then((result) => {
        active--;
        results.push(result);
        if (index === iterator.length && active === 0) {
          resolve(results);
        }
        if (active < limit) {
          next();
        }
      }).catch(reject);
    }

    while (index < iterator.length && active < limit) {
      next();
    }
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
], 2).then((res) => {
  console.log('res', res);
});


function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const middleIndex = Math.floor(arr.length / 2);
  const middleNum = arr[middleIndex];

  const leftArr = [];
  const rightArr = [];
  
  for(let i = 0; i < arr.length; i++) {
    if (i === middleIndex) {
      continue;
    }

    if (arr[i] < middleNum) {
      leftArr.push(arr[i]);
    } else {
      rightArr.push(arr[i]);
    }
  }

  return [...quickSort(leftArr), middleNum, ...quickSort(rightArr)];
}

function bubbleSort(arr) {
  const len = arr.length;
  for(let i = 0; i < len -1; i++) {
    for(j = 0; j < len - 1; j ++) {
      let temp;
      if (arr[j] > arr[j+1]) {
        temp = arr[j+1];
        arr[j+1] = arr[j];
        arr[j] = temp;
      }
    }
  }

  return arr;
}

console.log(quickSort([12,43,65,22,5,132,54,21,12,9,0]));
console.log(bubbleSort([12,43,65,22,5,132,54,21,12,9,0]));


function add() {
  let sum = 0;
  let args = Array.from(arguments);

  function _add() {
    const moreArgs = Array.from(arguments);
    args = args.concat(moreArgs);
    return arguments.length ? _add : caculate();
  }

  function caculate() {
    args.forEach((arg) => {
      sum = sum + arg;
    });
    args = [];

    return sum;
  }

  return _add;
}

console.log(add(1)(2)(3)());
console.log(add(1, 2, 3)(4)()); 

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







function flattern (arr) {
  return arr.reduce((prev, cur) => {
    return prev.contact(Array.isArray(cur) ? flattern(cur) : cur);
  }, []);
}

flattern([1, 2, [3, [4]], 5]);
