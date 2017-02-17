import CacheClient from './src/client';

export { default as Cache } from './src/cache';
export { default as readListCache } from './src/helper/read-list';
export { default as readObjectCache } from './src/helper/read-object';
export { default as writeListCache } from './src/helper/write-list';
export { default as writeObjectCache } from './src/helper/write-object';

export function cacheClient() {
  return new CacheClient();
}
