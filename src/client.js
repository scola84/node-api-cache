export default class Client {
  constructor() {
    this._connection = null;
    this._lifetime = 0;
  }

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
}
