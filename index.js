import CacheClient from './src/client';

export { default as Cache } from './src/cache';
export { default as cacheList } from './src/helper/list';
export { default as cacheObject } from './src/helper/object';
export { default as getList } from './src/helper/list/get';
export { default as setList } from './src/helper/list/set';
export { default as getObject } from './src/helper/object/get';
export { default as setObject } from './src/helper/object/set';
export { default as getTotal } from './src/helper/total/get';
export { default as setTotal } from './src/helper/total/set';

export function cacheClient() {
  return new CacheClient();
}
