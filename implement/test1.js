function throttle(func, wait) {
  let timer = null;
  return function (...args) {
    if (timer) {
      return;
    }

    timer = setInterval(() => {
      func.apply(this, args);
      timer = null;
    }, wait);
  }
}

function debounce(func, wait) {
  let timer = null;

  return function (...args) {
    if (timer) {
      clearInterval(timer);
    }

    timer = setInterval(() => {
      func.apply(this, args);
      timer = null;
    }, wait);
  }
}


function arrToTree(arr) {
  const map = new Map();
  const result = [];

  arr.forEach((item) => {
    map.set(item.id, { ...item, children: [] });
  });

  arr.forEach((item) => {
    if (item.pid === 0) {
      result.push(map.get(item.id));
    } else {
      map.get(item.pid).children.push(map.get(item.id));
    }
  });

  return result;
}

console.log(arrToTree([
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
]));

function deepClone(target, weakMap = new WeakMap()) {
  if (target === null) return target;
  if (target instanceof RegExp) return new RegExp(target);
  if (target instanceof Date) return new Date(target);

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
    const allKeys = Reflect.ownKeys(target);
    for (const key in allKeys) {
      const value = target[key];
      cloneTarget[key] = deepClone(value, weakMap);
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
    const callbacks = this.events[name] ||[];
    callbacks.push(callback);
    this.events[name] = callbacks;
  }

  emit(name, ...args) {
    const callbacks = this.events[name] || [];
    callbacks.forEach((callback) => {
      callback(args);
    })
  }

  off(name, callback) {
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


function all(iterator) {
  const isIterable = typeof iterator === 'object' 
  || typeof iterator === 'string' 
  || typeof iterator === 'function' 
  || iterator !== null;

  if (isIterable) {
    let count = 0;
    const result = [];
    const iteratorArr = Array.from(iterator);

    return new Promise((reslove, reject) => {
      if (iteratorArr.length) {
        reslove([]);
      }

      for(const item of iteratorArr) {
        Promise.resolve(item).then((res) =>{
          result.push(res);
          count++;

          if (count === iteratorArr.length) {
            reslove(result);
          }
        }).catch((err) => {
          reject(err);
        })
      }
    });
  } else {
    throw new Error();
  }
}

function race(iterator) {
  const iteratorArr = Array.from(iterator);
  return new Promise((reslove, reject) => {
    for(const item of iteratorArr) {
      Promise.resolve(item).then((res) => {
        reslove(res);
      }).catch(err => {
        reject(err);
      })
    }
  })
}

/**
 * 
 * @param {string} v1 
 * @param {string} v2 
 */
function compareVersion(v1, v2) {
  const v1Arr = v1.split('.').map((item) => Number(item));
  const v2Arr = v2.split('.').map((item) => Number(item));

  while(v1Arr.length > v2Arr.length) v2Arr.push(0);
  while(v2Arr.length > v1Arr.length) v1Arr.push(0);

  for(let i = 0; i < v1Arr.length; i++) {
    if (v1Arr[i] > v2Arr[i]) {
      return 1;
    }

    if (v1Arr[i] < v2Arr[i]) {
      return -1;
    }

    return 0;
  }
}

function limitAsyncRequest(iterator, limit) {
  return new Promise((resolve, reject) => {
    let active = 0;
    let index = 0;
    let results = [];

    function next() {
      if (index >= iterator.length || active > limit) {
        return;
      }

      active++;
      Promise.resolve(iterator[index]).then((res) => {
        active--;
        results.push(res);

        if (active < limit) {
          next();
        }

        if (index === iterator.length && active === 0) {
          resolve(results);
        }
      }).catch((err) => {
        reject(err);
      })
    }

    while(index < iterator.length && active < limit) {
      next();
    }
  })
}

function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }

  const leftArr = [];
  const rightArr = [];

  const middleIndex = Math.floor(arr.length / 2);
  const middleNum = arr[middleIndex];

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

function add(...initialArgs) {
  let sum = 0;
  let args = initialArgs;

  function _add(...moreArgs) {
    if (moreArgs.length > 0) {
      args = args.concat(moreArgs);
      return _add;
    } else {
      sum = args.reduce((acc, curr) => acc + curr, 0);
      args = []; // 清空 args 以便下次调用
      return sum;
    }
  }

  return _add;
}

console.log(add(1)(2)(3)()); // 输出: 6
console.log(add(1, 2, 3)(4)()); // 输出: 10





const listRef = useRef(null);
const itemRef = useRef(null)
const documentDom = document.documentDom;

function loadData() {

}

function VirtualList() {

  const [list, setList] = useState([]);
  const [currentTopIndex, setCurrentTopIndex] = useState(0)
  const [currentBottomIndex, setCurrentBottomIndex] = useState(0)
  

  const itemHeight = itemRef.current.style.height;
  const count = listRef.currnt.style.height / itemHeight

  useEffect(() => {

    window.addEventListener('scroll', (e) => {
      // 判断触底
      if (window.innerHeight + xxx > window.offsetHeight) {

      }
      
    })
  })

  return (
    <List ref={listRef}>
      {list.map((item) => {
        return <Item ref={itemRef} />
      })}
    </List>
  )
}

