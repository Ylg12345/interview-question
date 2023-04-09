function myNew(Fn, ...args) {
  if(typeof Fn !== 'function') {
    throw new TypeError('This is not a constructor')
  }

  const obj = {};
  obj.__proto__ = Fn.prototype;

  //使用调用者提供的 this 值和参数调用该函数的返回值。若该方法没有返回值，则返回 undefined。
  const result = Fn.call(obj, ...args);
  return typeof result === 'object' ? result : obj;
}


function Person(firtName, lastName) {
  this.firtName = firtName;
  this.lastName = lastName;

  // return {
  //   fullName: `${this.firtName} ${this.lastName}`
  // };

}

const tb = new Person('Chen', 'Tianbao');
console.log(tb);

const tb2 = myNew(Person, 'Chen', 'Tianbao');
console.log(tb2)