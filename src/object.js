import AbstractCache from './abstract';

export default class ObjectCache extends AbstractCache {
  constructor() {
    super();

    this._key = (request) => {
      return request.path();
    };
  }

  read(request, callback) {
    const key = this._key(request);

    this._read(key, (error, object) => {
      if (error) {
        callback(error);
        return;
      }

      this._cache.emit('read', request);
      callback(null, object);
    });
  }

  write(request, data, callback) {
    const key = this._key(request);
    this._write(key, data, callback);
  }
}
