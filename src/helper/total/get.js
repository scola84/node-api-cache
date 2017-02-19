import totalKeyFactory from './key';

export default function getTotal(cache, options = {}) {
  const keyFactory = options.key || totalKeyFactory;

  return (request, response, next) => {
    const key = keyFactory(request);

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
