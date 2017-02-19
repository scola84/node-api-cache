import { MD5 } from 'object-hash';
import objectKeyFactory from './key';

export default function setObject(cache, options = {}) {
  const keyFactory = options.key || objectKeyFactory;
  const end = options.end === false ? false : true;

  return (request, response, next) => {
    const key = keyFactory(request);

    cache.set(key, request.data(), (error, object) => {
      if (error) {
        next(error);
        return;
      }

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
    });
  };
}
