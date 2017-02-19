import { MD5 } from 'object-hash';

export default function getList(cache, end = true) {
  return (request, response, next) => {
    cache.get(request, (error, list, total) => {
      if (error) {
        next(error);
        return;
      }

      if (typeof total === 'number') {
        response.header('x-total', total);
      }

      if (list) {
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

        return;
      }

      next();
    });
  };
}
