import { EventEmitter } from 'events';
import { debuglog } from 'util';
import ListCache from './list';
import ObjectCache from './object';

export default class Cache extends EventEmitter {
  constructor() {
    super();

    this._log = debuglog('cache');
    this._client = null;

    this._lists = new Map();
    this._objects = new Map();
  }

  client(value = null) {
    if (value === null) {
      return this._client;
    }

    this._client = value;
    return this;
  }

  list(name) {
    if (!this._lists.has(name)) {
      this._lists.set(name, new ListCache()
        .cache(this)
        .client(this._client));
    }

    this._log('Cache list %s (%s)', name, this._lists.size);
    return this._lists.get(name);
  }

  object(name) {
    if (!this._objects.has(name)) {
      this._objects.set(name, new ObjectCache()
        .cache(this)
        .client(this._client));
    }

    this._log('Cache object %s (%s)', name, this._objects.size);
    return this._objects.get(name);
  }
}
