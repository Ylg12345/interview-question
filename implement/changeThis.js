Function.prototype.myBind = function(context, ...args) {
  if(!context && context === null) {
    context = window;
  }

  let fn = Symbol();

  context[fn] = this;
  let _this = this;

  const result = function(...innerArgs) {
    if(this instanceof _this === true) {
      this[fn] = _this;
      this[fn](args.concat(innerArgs));
      delete this[fn];
    } else {
      context[fn](args.concat(innerArgs));
      delete context[fn];
    }
  };

  result.prototype = Object.create(this.prototype);
  return result;
}


Function.prototype.myCall = function(context, ...args) {
  if(typeof this !== 'function') {
    throw new TypeError('call object is not a function')
  }

  if(!context && context === null) {
    context = window;
  }

  let result = null;
  context[fn] = this;
  result = context[fn](...args);
  delete context[fn];
  return result;
}


Function.prototype.myApply = function(context, args) {
  if(typeof this !== 'function') {
    throw new TypeError('call object is not a function')
  }

  if(!context && context === null) {
    context = window;
  }

  let result = null;
  context[fn] = this;
  result = context[fn]([...args]);
  delete context[fn];
  return result;
}
