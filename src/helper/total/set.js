import totalKeyFactory from './key';

export default function setList(cache, options = {}) {
  const keyFactory = options.key || totalKeyFactory;

  return (request, response, next) => {
    if (typeof response.header('x-total') === 'number') {
      next();
      return;
    }

    const key = keyFactory(request);

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
