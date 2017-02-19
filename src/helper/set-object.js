import { MD5 } from 'object-hash';

export default function setObject(cache, end = true) {
  return (request, response, next) => {
    const value = request.data();

    cache.set(request, value, (error, object) => {
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
