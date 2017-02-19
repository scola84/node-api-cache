import AbstractCache from './abstract';

export default class ObjectCache extends AbstractCache {
  constructor() {
    super();

    this._key = (request) => {
      return request.path();
    };
  }

  get(request, callback) {
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
    const key = this._key(request);
    this._client.del(key, callback);
  }
}
