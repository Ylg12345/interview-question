

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

function debounce(fn, wait, immediate) {
  let timer = null;
  return function(...args) {
    if(timer) {
      clearInterval(timer);
    }
    if (immediate && !timer) {
      fn.apply(this, args);
    }
    timer = setTimeout(function() {
      if (!immediate) {
        fn.apply(this, args);
      } else {
        timer = null;
      }
    }, wait);
  }
}


const span = document.querySelector('.name');
const input = document.querySelector('.input');

function changeName (e) {
  console.log(444)
  span.innerHTML = e.target.value;
};

const _changeName = debounce(changeName, 1000, true);

input.onkeyup = _changeName;
