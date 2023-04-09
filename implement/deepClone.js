
// 由于键值是对象，我们可以使用 Weakmap 利于内存回收

const weakMap = new WeakMap()

function deepClone(target) {
  if(typeof target === 'object') {
    let cloneTarget = Array.isArray(target) ? [] : {};
    if(weakMap.get(target)) {
      return weakMap.get(target);
    }

    weakMap.set(target, cloneTarget);

    for(const key in target) {
      cloneTarget[key] = deepClone(target[key]);
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
      d: 4
    }
  },
  f: function() {
    console.log(this.name);
  }
}

obj.self = obj;

console.log(deepClone(obj));