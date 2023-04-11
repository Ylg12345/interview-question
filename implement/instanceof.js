function myInstanceof(target, origin) {
  while(target) {
    if(target.__proto__ === origin.prototype) {
      return true;
    }

    target = target.__proto__;
  }

  return false;
}

let arr = [1, 2, 3];

console.log(myInstanceof(arr, Array));