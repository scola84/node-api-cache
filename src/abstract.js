export default class AbstractCache {
  constructor() {
    this._cache = null;
    this._channel = null;
    this._client = null;
    this._date = Date.now();
    this._key = null;

    this._handlePublish = () => this._publish();
  }

  cache(value = null) {
    if (value === null) {
      return this._cache;
    }

    this._cache = value;
    return this;
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

  date(value = null) {
    if (value === null) {
      return this._date;
    }

    this._date = value;
    return this;
  }

  key(value = null) {
    if (value === null) {
      return this._key;
    }

    this._key = value;
    return this;
  }

  get() {
    throw new Error('Not implemented');
  }

  set() {
    throw new Error('Not implemented');
  }

  del() {
    throw new Error('Not implemented');
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

  _publish() {
    this.date(Date.now());
  }
}
