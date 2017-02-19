import { MD5 } from 'object-hash';
import listKeyFactory from './key';

export default function getList(cache, options = {}) {
  const keyFactory = options.key || listKeyFactory;
  const end = options.end === false ? false : true;

  return (request, response, next) => {
    const key = keyFactory(request);

    cache.get(key, (error, list) => {
      if (error) {
        next(error);
        return;
      }

      if (!list) {
        next();
        return;
      }

      cache.cache().emit('hit', request);

      const hash = MD5(list);

      if (request.header('x-etag') === hash) {
        response.status(304);

        if (end === true) {
          response.end();
        } else {
          response.write('');
        }

        return;
      }

      response.header('x-etag', hash);

      if (end === true) {
        response.end(list);
      } else {
        response.write(list);
      }

      next();
    });
  };
}
