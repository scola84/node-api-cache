import { EventEmitter } from 'events';
import { debuglog } from 'util';
import Cache from './cache';

export default class Factory extends EventEmitter {
  constructor() {
    super();

    this._log = debuglog('cache');
    this._client = null;
    this._cache = new Map();
  }

  client(value = null) {
    if (value === null) {
      return this._client;
    }

    this._client = value;
    return this;
  }

  create(path) {
    if (!this._cache.has(path)) {
      this._cache.set(path, new Cache()
        .factory(this)
        .client(this._client));
    }

    return this._cache.get(path);
  }
}
