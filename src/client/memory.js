import Client from '../client';

export default class MemoryClient extends Client {
  del(key, callback = () => {}) {
    this._connection.del(key);
    callback(null);
  }

  get(key, callback = () => {}) {
    let value = this._connection.get(key);

    if (typeof value === 'undefined') {
      value = null;
    } else if (this._touch === true) {
      this._connection.put(key, value, this._lifetime * 1000);
    }

    callback(null, value);
  }

  set(key, value, callback = () => {}) {
    this._connection.put(key, value, this._lifetime * 1000);
    callback(null, value);
  }
}
