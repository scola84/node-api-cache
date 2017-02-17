export default class CacheClient {
  constructor() {
    this._values = {};
  }

  set(key, value, callback) {
    this._values[key] = value;
    callback();
  }

  get(key, callback) {
    callback(null, this._values[key]);
  }

  del(key, callback) {
    delete this._values[key];
    callback();
  }
}
