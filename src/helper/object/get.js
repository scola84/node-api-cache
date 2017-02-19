import { MD5 } from 'object-hash';
import objectKeyFactory from './key';

export default function getObject(cache, options = {}) {
  const keyFactory = options.key || objectKeyFactory;
  const end = options.end === false ? false : true;

  return (request, response, next) => {
    const key = keyFactory(request);

    cache.get(key, (error, object) => {
      if (error) {
        next(error);
        return;
      }

      if (!object) {
        next();
        return;
      }

      cache.cache().emit('hit', request);

      const hash = MD5(object);

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
        response.end(object);
      } else {
        response.write(object);
      }

      next();
    });
  };
}
