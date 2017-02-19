import { MD5 } from 'object-hash';

export default function getObject(cache, end = true) {
  return (request, response, next) => {
    cache.get(request, (error, object) => {
      if (error) {
        next(error);
        return;
      }

      if (object) {
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

        return;
      }

      next();
    });
  };
}
