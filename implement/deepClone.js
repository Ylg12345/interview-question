
// 由于键值是对象，我们可以使用 Weakmap 利于内存回收

function deepClone(target, weakMap = new WeakMap()) {

  if(target === null) return target;
  if(target instanceof Date) return new Date(target);
  if(target instanceof RegExp) return new RegExp(target);

  // if(
  //   target instanceof Map || 
  //   target instanceof WeakMap || 
  //   target instanceof Set ||
  //   target instanceof WeakSet
  // ) {
  //   return target;
  // }

  if(typeof target === 'object') {
    let cloneTarget = {};
    if(weakMap.get(target)) {
      return weakMap.get(target);
    }

    weakMap.set(target, cloneTarget);

    for(const key in target) {
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
  e: function() {
    console.log(this.name);
  },
  g: new Date(),
  h: new RegExp(),
  i: null
}

obj.a.c.f = obj.a;
obj.a.c.j = obj.c;

console.log(deepClone(obj));
