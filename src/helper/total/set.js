import keyFactory from './key';

export default function getTotal(cache, options = {}) {
  const fields = options.total ? options.total : ['where'];

  return (request, response, next) => {
    if (typeof response.header('x-total') === 'number') {
      next();
      return;
    }

    const key = keyFactory(request, fields);

    cache.set(key, request.data(), (error, total) => {
      if (error) {
        next(error);
        return;
      }

      response.header('x-total', total);
      next();
    });
  };
}
