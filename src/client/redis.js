import Client from '../client';

export default class RedisClient extends Client {
  destroy() {
    if (this._connection) {
      this._connection.quit();
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
      this._handleGet(key, value, cacheError, callback);
    });
  }

  set(key, value, callback = () => {}) {
    try {
      value = JSON.stringify(value);
    } catch (error) {
      callback(error);
      return;
    }

    this._connection.set(key, value, (error) => {
      this._handleSet(key, value, error, callback);
    });
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
      this._connection.expire(key, this._lifetime);
    }

    try {
      value = JSON.parse(value);
    } catch (parseError) {
      callback(parseError);
      return;
    }

    callback(null, value);
  }

  _handleSet(key, value, error, callback) {
    if (error instanceof Error === true) {
      callback(error);
      return;
    }

    if (this._lifetime > 0) {
      this._connection.expire(key, this._lifetime);
    }

    callback(null, value);
  }
}
