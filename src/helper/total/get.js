import defaults from 'lodash-es/defaults';
import keyFactory from './key';

export default function getTotal(cache, options = {}) {
  options = defaults({}, options, {
    total: ['where']
  });

  return (request, response, next) => {
    const key = keyFactory(request, options.total);

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
