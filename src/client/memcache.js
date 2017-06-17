import Client from '../client';

export default class MemCacheClient extends Client {
  destroy() {
    if (this._connection) {
      this._connection.end();
      this._connection = null;
    }
  }

  del(key, callback = () => {}) {
    this._connection.del(key, (error) => {
      this._handleDel(error, callback);
    });
  }

  get(key, callback = () => {}) {
    this._connection.get(key, (cacheError, value) => {
      try {
        this._handleGet(key, value, cacheError, callback);
      } catch (error) {
        callback(error);
      }
    });
  }

  set(key, value, callback = () => {}) {
    try {
      this._connection.set(key, JSON.stringify(value),
        this._lifetime, (error) => {
          this._handleSet(key, value, error, callback);
        });
    } catch (error) {
      callback(error);
    }
  }

  _handleDel(error, callback) {
    if (error instanceof Error === true) {
      callback(error);
      return;
    }

    callback(null);
  }

  _handleGet(key, value, error, callback) {
    if (error instanceof Error === true) {
      callback(error);
      return;
    }

    if (typeof value === 'undefined') {
      value = null;
    } else if (this._touch === true) {
      this._connection.touch(key, this._lifetime);
    }

    callback(null, JSON.parse(value));
  }

  _handleSet(key, value, error, callback) {
    if (error instanceof Error === true) {
      callback(error);
      return;
    }

    callback(null, value);
  }

}
