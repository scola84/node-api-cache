export default class AbstractCache {
  constructor() {
    this._cache = null;
    this._client = null;
    this._key = null;
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

  get() {
    throw new Error('Not implemented');
  }

  set() {
    throw new Error('Not implemented');
  }

  del() {
    throw new Error('Not implemented');
  }
}
