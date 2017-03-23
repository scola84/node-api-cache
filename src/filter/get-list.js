import parallel from 'async/parallel';
import defaults from 'lodash-es/defaults';
import handleEtag from '../helper/etag';
import keyFactory from '../helper/key';

export default function getList(cache, options = {}) {
  options = defaults({}, options, {
    etag: true,
    list: null,
    total: ['where']
  });

  const write = Boolean(cache.channel());

  return (request, response, next) => {
    const listKey = keyFactory(request, options.list);
    const totalKey = keyFactory(request, options.total);

    const tasks = {
      list: (callback) => cache.list(listKey, callback),
      total: (callback) => cache.get(totalKey, callback)
    };

    parallel(tasks, (error, result) => {
      if (error) {
        next(error);
        return;
      }

      request.data(result);

      if (typeof result.total !== 'undefined') {
        response.header('x-total', result.total);
      }

      if (!result.list) {
        next();
        return;
      }

      cache.factory().emit('hit', request);

      const etag = options.etag === true &&
        handleEtag(request, response, result.list, write);

      if (etag) {
        next();
        return;
      }

      if (write === true) {
        response.write(result.list);
      } else {
        response.end(result.list);
      }

      next();
    });
  };
}
