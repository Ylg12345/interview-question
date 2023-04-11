// 组合继承

// function SuperType(name) {
//   this.name = name;
//   this.colors = ["red","yellow","bule"];
// }

// SuperType.prototype.sayName = function() {
//   console.log(this.name)
// }

// function SubType(name, age) {
//   SuperType.call(this, name);
//   this.age = age;
// }

// SubType.prototype = new SuperType();
// SubType.prototype.sayAge = function(){
//     console.log(this.age);
// }

// const subType = new SubType('ylg', 23);


// 寄生组合式继承

function SuperType(name) {
  this.name = name;
  this.colors = ["red","yellow","bule"];
}

SuperType.prototype.sayName = function() {
  console.log(this.name)
}

function SubType(name, age) {
  SuperType.call(this, name);
  this.age = age;
}

let clonePrototype = Object.create(SuperType.prototype);
clonePrototype.constructor = new SubType();
subType.prototype = clonePrototype;

SubType.prototype.sayAge = function(){
    console.log(this.age);
}

const subType = new SubType('ylg', 23);