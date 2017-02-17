export default class AbstractCache {
  constructor() {
    this._cache = null;
    this._client = null;
    this._key = null;
    this._date = null;

    this.touch();
  }

  cache(value = null) {
    if (value === null) {
      return this._cache;
    }

    this._cache = value;
    return this;
  }

  client(value = null) {
    if (value === null) {
      return this._client;
    }

    this._client = value;
    return this;
  }

  key(value = null) {
    if (value === null) {
      return this._key;
    }

    this._key = value;
    return this;
  }

  touch() {
    this._date = Date.now();
    return this;
  }

  read() {
    throw new Error('Not implemented');
  }

  write() {
    throw new Error('Not implemented');
  }

  _read(key, callback) {
    this._client.get(key, (error, value) => {
      if (error) {
        callback(error);
        return;
      }

      if (!value) {
        callback();
        return;
      }

      if (value.date < this._date) {
        this._client.del(key, () => callback());
        return;
      }

      callback(null, value.data);
    });
  }

  _write(key, data, callback) {
    const value = {
      data,
      date: Date.now()
    };

    this._client.set(key, value, (error) => {
      if (error) {
        callback(error);
        return;
      }

      callback(null, data);
    });
  }
}
