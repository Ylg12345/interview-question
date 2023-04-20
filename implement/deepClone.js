
// 由于键值是对象，我们可以使用 Weakmap 利于内存回收

const weakMap = new WeakMap()
function deepClone(target) {

  if(target === null) return target;
  if(target instanceof Date) return new Date(target);
  if(target instanceof RegExp) return new RegExp(target);

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
  e: function() {
    console.log(this.name);
  },
  g: new Date(),
  h: new RegExp(),
  i: null
}

obj.self = obj;

console.log(deepClone(obj));