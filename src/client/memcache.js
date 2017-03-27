import Client from '../client';

export default class MemCacheClient extends Client {
  del(key, callback = () => {}) {
    this._connection.del(key, (error) => {
      this._handleDel(error, callback);
    });
  }

  get(key, callback = () => {}) {
    this._connection.get(key, (cacheError, value) => {
      try {
        this._handleGet(cacheError, value, callback);
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

  _handleGet(error, value, callback) {
    if (error instanceof Error === true) {
      callback(error);
      return;
    }

    if (typeof value === 'undefined') {
      value = null;
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
