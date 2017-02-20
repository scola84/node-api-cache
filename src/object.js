import { debuglog } from 'util';
import AbstractCache from './abstract';

export default class ObjectCache extends AbstractCache {
  constructor() {
    super();

    this._log = debuglog('cache');
  }

  get(key, callback = () => {}) {
    this._log('ObjectCache get %s', key);

    this._client.get(key, (error, value) => {
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
    this._log('ObjectCache set %s', key);

    this._client.set(key, value, (error) => {
      if (error) {
        callback(error);
        return;
      }

      callback(null, value);
    });
  }

  del(key, callback) {
    this._log('ObjectCache del %s', key);
    this._client.del(key, callback);
  }
}
