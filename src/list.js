import { sha1 } from 'object-hash';
import { debuglog } from 'util';
import AbstractCache from './abstract';

export default class ListCache extends AbstractCache {
  constructor() {
    super();
    this._log = debuglog('cache');
  }

  get(key, callback = () => {}) {
    this._log('ListCache get %j', key);

    key = sha1(key);

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

  set(key, data, callback = () => {}) {
    this._log('ListCache set %j', key);

    key = sha1(key);

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

  del(key, callback) {
    this._log('ListCache del %j', key);
    this._client.del(sha1(key), callback);
  }
}
