/**
 * 
 * @param {number} wait
 * @param {Function} fn
 */

function throttle(fn, wait) {
  let timer = null;
  return function(...args) {
    if(timer) {
      return;
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, wait)
  }
}

/**
 * 
 * @param {number} wait
 * @param {Function} fn
 */

function debounce(fn, wait) {
  let timer = null;
  return function(...args) {
    if(timer) {
      clearInterval(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait)
  }
}

