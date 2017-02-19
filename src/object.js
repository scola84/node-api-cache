import { debuglog } from 'util';
import AbstractCache from './abstract';

export default class ObjectCache extends AbstractCache {
  constructor() {
    super();

    this._log = debuglog('cache');

    this._key = (request) => {
      return request.path();
    };
  }

  get(request, callback) {
    this._log('ObjectCache get %s', request.path());

    const key = this._key(request);

    this._client.get(key, (error, value) => {
      if (error) {
        callback(error);
        return;
      }

      if (!value) {
        callback();
        return;
      }

      this._cache.emit('hit', request);
      callback(null, value);
    });
  }

  set(request, value, callback) {
    this._log('ObjectCache set %s', request.path());

    const key = this._key(request);

    this._client.set(key, value, (error) => {
      if (error) {
        callback(error);
        return;
      }

      callback(null, value);
    });
  }

  del(request, callback) {
    this._log('ObjectCache del %s', request.path());

    const key = this._key(request);
    this._client.del(key, callback);
  }
}
