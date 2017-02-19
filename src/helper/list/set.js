import { MD5 } from 'object-hash';
import listKeyFactory from './key';

export default function setList(cache, options = {}) {
  const keyFactory = options.key || listKeyFactory;
  const end = options.end === false ? false : true;

  return (request, response, next) => {
    const key = keyFactory(request);

    cache.set(key, request.data(), (error, list) => {
      if (error) {
        next(error);
        return;
      }

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
    });
  };
}
