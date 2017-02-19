import { MD5 } from 'object-hash';

export default function setList(cache, end = true) {
  return (request, response, next) => {
    const value = request.data();
    const setTotal = typeof response.header('x-total') !== 'number';

    cache.set(request, value, setTotal, (error, list, total) => {
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

      if (typeof total === 'number') {
        response.header('x-total', total);
      }

      if (end === true) {
        response.end(list);
      } else {
        response.write(list);
      }
    });
  };
}
