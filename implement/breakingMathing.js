/**
 * 
 * @param {string} left
 * @param {string} right
 * @returns {boolean}
 */

function isMath(left, right) {
  if(left === '{' &&　right === '}') return true;
  if(left === '(' &&　right === ')') return true;
  if(left === '[' &&　right === ']') return true;
  return false;
}

/**
 * 
 * @param {string} str
 * @returns {boolean}
 */

function breakingMathing(str) {
  if(str.length === 0) {
    return true
  };

  const stack = [];
  const left = '[{(';
  const right = ')}]';

  for(let i = 0; i < str.length; i++) {
    if(left.includes(str[i])) {
      stack.push(str[i]);
    } else if(right.includes(str[i])) {
      const pre = stack[stack.length - 1]; 
      if(isMath(pre, str[i])) {
        stack.pop();
      } else {
        stack.push(str[i]);
      }
    }
  }

  if(stack.length === 0) {
    return true;
  }

  return false;
}

console.log(breakingMathing('(({))'));