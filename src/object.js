import { sha1 } from 'object-hash';
import { debuglog } from 'util';
import AbstractCache from './abstract';

export default class ObjectCache extends AbstractCache {
  constructor() {
    super();
    this._log = debuglog('cache');
  }

  get(key, callback = () => {}) {
    this._log('ObjectCache get %j', key);

    this._client.get(sha1(key), (error, value) => {
      if (error) {
        callback(error);
        return;
      }

      if (!value) {
        callback();
        return;
      }

      callback(null, value);
    });
  }

  set(key, value, callback = () => {}) {
    this._log('ObjectCache set %j %j', key, value);

    this._client.set(sha1(key), value, (error) => {
      if (error) {
        callback(error);
        return;
      }

      callback(null, value);
    });
  }

  del(key, callback) {
    this._log('ObjectCache del %j', key);
    this._client.del(sha1(key), callback);
  }
}
