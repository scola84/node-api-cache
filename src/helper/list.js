import getList from './list/get';
import setList from './list/set';
import getTotal from './total/get';
import setTotal from './total/set';

export default function cacheList(cache, options) {
  return [
    getTotal(cache, options),
    setTotal(cache, options),
    getList(cache, options),
    setList(cache, options)
  ];
}
