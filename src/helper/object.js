import getObject from './object/get';
import setObject from './object/set';

export default function cacheObject(cache, options) {
  return [
    getObject(cache, options),
    setObject(cache, options)
  ];
}
