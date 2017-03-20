import md5 from 'crypto-js/md5';
import { debuglog } from 'util';

export default class Cache {
  constructor() {
    this._log = debuglog('cache');

    this._channel = null;
    this._client = null;
    this._factory = null;

    this._date = Date.now();

    this._handlePublish = (e) => this._publish(e);
  }

  destroy() {
    this._unbindChannel();

    this._channel = null;
    this._client = null;
    this._factory = null;
  }

  channel(value = null) {
    if (value === null) {
      return this._channel;
    }

    this._channel = value;
    this._bindChannel();

    return this;
  }

  client(value = null) {
    if (value === null) {
      return this._client;
    }

    this._client = value;
    return this;
  }

  factory(value = null) {
    if (value === null) {
      return this._factory;
    }

    this._factory = value;
    return this;
  }

  get(key, callback) {
    this._log('Cache get %j', key);
    this._get(key, true, callback);
  }

  list(key, callback) {
    this._log('Cache list %j', key);
    this._get(key, true, callback);
  }

  object(key, callback) {
    this._log('Cache object %j', key);
    this._get(key, false, callback);
  }

  set(key, data, callback = () => {}) {
    this._log('Cache set %j', key);

    key = this._hash(key);

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
    this._log('Cache del %j', key);
    this._client.del(this._hash(key), callback);
  }

  _bindChannel() {
    if (this._channel) {
      this._channel.on('publish', this._handlePublish);
    }
  }

  _unbindChannel() {
    if (this._channel) {
      this._channel.removeListener('publish', this._handlePublish);
    }
  }

  _get(key, check, callback = () => {}) {
    key = this._hash(key);

    this._client.get(key, (error, value) => {
      if (error) {
        callback(error);
        return;
      }

      if (!value) {
        callback();
        return;
      }

      if (check === true && value.date < this._date) {
        this._client.del(key, () => callback());
        return;
      }

      callback(null, value.data);
    });
  }

  _publish(event) {
    this._log('Cache _publish %j', event);

    const key = [event.path, {}];

    switch (event.type) {
      case 'insert':
        this.set(key, event.data);
        break;
      case 'update':
        this.set(key, event.data);
        break;
      case 'delete':
        this.del(key);
        break;
    }

    this._date = Date.now();
  }

  _hash(key) {
    return md5(JSON.stringify(key)).toString();
  }
}
