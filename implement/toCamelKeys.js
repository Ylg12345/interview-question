function toCamel(str) {
  return str.replace(/_([a-z])/g, (match, offset) => {
    return offset.toUpperCase();
  });
}

function isObject(obj) {
  const type = Object.prototype.toString.call(obj).slice(8, -1).toLocaleLowerCase();
  if(type === 'object') {
    return true;
  }

  return false;
}

function toCamelKeys(obj) { 
  const newObj = {};

  if(isObject(obj)) {
    for(key in obj) {
      const newKey = toCamel(key);

      if(isObject(obj[key]) && obj[key] !== null) {
        newObj[newKey] = toCamelKeys(obj[key]);
      } else {
        newObj[newKey] = obj[key]
      }
    }
  } else {
    throw new TypeError('obj is not a Object');
  }

  return newObj;
}

const obj = {
  a_b_c: {
    c_d_e: 1
  },
  f_k: 3
};

console.log(toCamelKeys(obj));
