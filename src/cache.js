import { EventEmitter } from 'events';
import ListCache from './list';
import ObjectCache from './object';

export default class Cache extends EventEmitter {
  constructor() {
    super();

    this._client = null;
    this._lists = {};
    this._objects = {};
  }

  client(value = null) {
    if (value === null) {
      return this._client;
    }

    this._client = value;
    return this;
  }

  list(name) {
    if (!this._lists[name]) {
      this._lists[name] = new ListCache()
        .cache(this)
        .client(this._client);
    }

    return this._lists[name];
  }

  object(name) {
    if (!this._objects[name]) {
      this._objects[name] = new ObjectCache()
        .cache(this)
        .client(this._client);
    }

    return this._objects[name];
  }
}
