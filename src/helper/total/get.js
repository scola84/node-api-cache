import keyFactory from './key';

export default function getTotal(cache, options = {}) {
  const fields = options.total ? options.total : ['where'];

  return (request, response, next) => {
    const key = keyFactory(request, fields);

    cache.get(key, (error, total) => {
      if (error) {
        next(error);
        return;
      }

      if (total) {
        response.header('x-total', total);
      }

      next();
    });
  };
}
