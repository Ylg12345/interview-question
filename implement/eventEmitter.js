class EventEmitter {
  constructor() {
    this._events = {};
  }

  on(name, callback) {
    const callbacks = this._events[name] || [];
    callbacks.push(callback);
    this._events[name] = callbacks;
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
    const wrapperFn = (...args) => {
      callback.apply(this, args);
      this.off(name, wrapperFn);
    }

    this.on(name, wrapperFn);
  }
}

const events = new EventEmitter()

events.on("newListener", function(eventName){
  console.log(`eventName`, eventName)
})

const log = (val) => {
  console.log(val);
}

events.on("hello", log)

events.once("world", log);

events.emit("hello", 1);

events.off("hello", log)

events.emit("hello", 2);

events.emit("world", 1);

events.emit("world", 2);
