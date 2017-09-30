import md5 from 'crypto-js/md5';
import { debuglog } from 'util';

export default class Cache {
  constructor() {
    this._log = debuglog('cache');
    this._client = null;
  }

  destroy() {
    if (this._client) {
      this._client.destroy();
      this._client = null;
    }
  }

  client(value = null) {
    if (value === null) {
      return this._client;
    }

    this._client = value;
    return this;
  }

  del(key, callback = () => {}) {
    this._log('Cache del key=%j', key);
    this._client.del(key, callback);
  }

  get(key, field, callback = () => {}) {
    this._log('Cache get key=%j field=%j', key, field);

    this._client.get(this._hash(key, field), (error, value) => {
      if (error instanceof Error === true) {
        callback(error);
        return;
      }

      if (value === null) {
        callback();
        return;
      }

      this._client.get(key, (dateError, date) => {
        if (date === null || value.date > date) {
          callback(null, value.data);
          return;
        }

        callback();
      });
    });
  }

  set(key, field, data, callback = () => {}) {
    this._log('Cache set key=%j field=%j data=%j', key, field, data);

    this._client.set(this._hash(key, field), {
      data,
      date: Date.now()
    }, (error) => {
      if (error instanceof Error === true) {
        callback(error);
        return;
      }

      callback(null, data);
    });
  }

  invalidate(key, callback = () => {}) {
    this._log('Cache invalidate key=%j', key);
    this._client.set(key, Date.now(), callback);
  }

  _hash(key, field) {
    return key + ':' + md5(field);
  }
}
