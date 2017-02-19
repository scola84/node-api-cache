import parallel from 'async/parallel';
import { debuglog } from 'util';
import AbstractCache from './abstract';

export default class ListCache extends AbstractCache {
  constructor() {
    super();

    this._log = debuglog('cache');
    this._date = null;

    this._key = (request, scope) => {
      return JSON.stringify([
        request.path(),
        request.query('where'),
        request.query('order'),
        scope === 'list' ? request.query('limit') : '',
      ]);
    };

    this.touch();
  }

  touch() {
    this._date = Date.now();
    return this;
  }

  get(request, callback) {
    this._log('ListCache get %s', request.path());

    parallel([
      (c) => {
        const key = this._key(request, 'list');
        this._get(key, c);
      },
      (c) => {
        const key = this._key(request, 'total');
        this._get(key, c);
      }
    ], (error, [list, total]) => {
      if (error) {
        callback(error);
        return;
      }

      if (list) {
        this._cache.emit('hit', request);
      }

      callback(null, list, total);
    });
  }

  set(request, data, setTotal, callback) {
    this._log('ListCache set %s', request.path());

    if (!setTotal) {
      const key = this._key(request, 'list');
      this._set(key, data, callback);
      return;
    }

    parallel([
      (c) => {
        const key = this._key(request, 'list');
        this._set(key, data[0], c);
      },
      (c) => {
        const key = this._key(request, 'total');
        this._set(key, data[1][0].total, c);
      }
    ], (error, [list, total]) => {
      if (error) {
        callback(error);
        return;
      }

      callback(null, list, total);
    });
  }

  del(request, callback) {
    this._log('ListCache del %s', request.path());

    parallel([
      (c) => {
        const key = this._key(request, 'list');
        this._client.del(key, c);
      },
      (c) => {
        const key = this._key(request, 'total');
        this._client.del(key, c);
      }
    ], callback);
  }

  _get(key, callback) {
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

  _set(key, data, callback) {
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
}
