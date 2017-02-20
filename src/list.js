import { debuglog } from 'util';
import AbstractCache from './abstract';

export default class ListCache extends AbstractCache {
  constructor() {
    super();

    this._log = debuglog('cache');
    this._date = Date.now();
  }

  date(value = null) {
    if (value === null) {
      return this._date;
    }

    this._log('ListCache date %s', value);

    this._date = value;
    return this;
  }

  get(key, callback = () => {}) {
    this._log('ListCache get %s', key);

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
    this._log('ListCache set %s', key);

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
    this._log('ListCache del %s', key);
    this._client.del(key, callback);
  }
}
