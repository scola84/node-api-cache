import defaults from 'lodash-es/defaults';
import keyFactory from './key';

export default function getTotal(cache, options = {}) {
  options = defaults({}, options, {
    total: ['where']
  });

  return (request, response, next) => {
    if (typeof response.header('x-total') === 'number') {
      next();
      return;
    }

    const key = keyFactory(request, options.total);

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
