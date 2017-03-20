import { EventEmitter } from 'events';
import { debuglog } from 'util';
import Cache from './cache';

export default class CacheFactory extends EventEmitter {
  constructor() {
    super();

    this._log = debuglog('cache');
    this._client = null;
    this._instances = new Map();
  }

  destroy() {
    this._instances.forEach((instance) => {
      instance.destroy();
    });

    this._instances.clear();
    this._client = null;
  }

  client(value = null) {
    if (value === null) {
      return this._client;
    }

    this._client = value;
    return this;
  }

  create(path) {
    if (!this._instances.has(path)) {
      this._instances.set(path, new Cache()
        .factory(this)
        .client(this._client));
    }

    return this._instances.get(path);
  }
}
