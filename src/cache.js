import md5 from 'crypto-js/md5';
import { debuglog } from 'util';

export default class Cache {
  constructor() {
    this._log = debuglog('cache');
    this._client = null;
    this._dates = new Map();
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

    const hash = this._hash([key, field]);

    this._client.get(hash, (error, value) => {
      if (error instanceof Error === true) {
        callback(error);
        return;
      }

      const invalid =
        value === null ||
        this._dates.has(key) === true &&
        value.date < this._dates.get(key);

      if (invalid === true) {
        callback(null, null);
        return;
      }

      callback(null, value.data);
    });
  }

  set(key, field, data, callback = () => {}) {
    this._log('Cache set key=%j field=%j data=%j', key, field, data);

    const hash = this._hash([key, field]);

    const value = {
      data,
      date: Date.now()
    };

    this._client.set(hash, value, (error) => {
      if (error instanceof Error === true) {
        callback(error);
        return;
      }

      callback(null, data);
    });
  }

  invalidate(key, callback = () => {}) {
    this._log('Cache invalidate key=%j', key);
    this._dates.set(key, Date.now());
    callback();
  }

  _hash(key) {
    return md5(JSON.stringify(key)).toString();
  }
}
