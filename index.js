import Cache from './src/cache';
import CacheClient from './src/client';
import cacheList from './src/helper/list';
import cacheObject from './src/helper/object';
import getList from './src/helper/list/get';
import setList from './src/helper/list/set';
import getObject from './src/helper/object/get';
import setObject from './src/helper/object/set';
import getTotal from './src/helper/total/get';
import setTotal from './src/helper/total/set';

function cacheClient() {
  return new CacheClient();
}

export {
  Cache,
  CacheClient,
  cacheClient,
  cacheList,
  cacheObject,
  getList,
  setList,
  getObject,
  setObject,
  getTotal,
  setTotal
};
