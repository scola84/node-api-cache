import CacheClient from './src/client';

export { default as Cache } from './src/cache';
export { default as getList } from './src/helper/get-list';
export { default as getObject } from './src/helper/get-object';
export { default as setList } from './src/helper/set-list';
export { default as setObject } from './src/helper/set-object';

export function cacheClient() {
  return new CacheClient();
}
