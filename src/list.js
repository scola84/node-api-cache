import parallel from 'async/parallel';
import AbstractCache from './abstract';

export default class ListCache extends AbstractCache {
  constructor() {
    super();

    this._key = (request, scope) => {
      return JSON.stringify([
        request.path(),
        request.query('where'),
        request.query('order'),
        scope === 'list' ? request.query('limit') : '',
      ]);
    };
  }

  read(request, callback) {
    parallel([
      (c) => {
        const key = this._key(request, 'list');
        this._read(key, c);
      },
      (c) => {
        const key = this._key(request, 'total');
        this._read(key, c);
      }
    ], (error, [list, total]) => {
      if (error) {
        callback(error);
        return;
      }

      if (list) {
        this._cache.emit('read', request);
      }

      callback(null, list, total);
    });
  }

  write(request, data, writeTotal, callback) {
    if (!writeTotal) {
      const key = this._key(request, 'list');
      this._write(key, data, callback);
      return;
    }

    parallel([
      (c) => {
        const key = this._key(request, 'list');
        this._write(key, data[0], c);
      },
      (c) => {
        const key = this._key(request, 'total');
        this._write(key, data[1][0].total, c);
      }
    ], (error, [list, total]) => {
      if (error) {
        callback(error);
        return;
      }

      callback(null, list, total);
    });
  }
}
