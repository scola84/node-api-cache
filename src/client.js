export default class Client {
  constructor() {
    this._connection = null;
    this._lifetime = 0;
    this._touch = false;
  }

  destroy() {}

  connection(value = null) {
    if (value === null) {
      return this._connection;
    }

    this._connection = value;
    return this;
  }

  lifetime(value = null) {
    if (value === null) {
      return this._lifetime;
    }

    this._lifetime = value;
    return this;
  }

  touch(value = null) {
    if (value === null) {
      return this._touch;
    }

    this._touch = value;
    return this;
  }
}
