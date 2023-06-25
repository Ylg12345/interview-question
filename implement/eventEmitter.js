class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(name, callback) {
    const callbacks = this._events[name] || [];
    callbacks.push(callback);
    this._events[eventName] = callbacks;
  }

  emit(name, ...args) {
    const callbacks = this._events[name] || [];
    callbacks.forEach(cb => cb(...args));
  }

  off(name, callback) {
    const callbacks = this._events[name] || [];
    const newCallbacks = callbacks.filter((fn) => fn !== callback);
    this._events[name] = newCallbacks;
  }

  once(name, callback){
    
  }
}

const events = new EventEmitter()

events.on("newListener", function(eventName){
  console.log(`eventName`, eventName)
})

events.on("hello", function(){
  console.log("hello");
})

events.emit("hello");
