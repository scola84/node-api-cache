import parallel from 'async/parallel';
import defaults from 'lodash-es/defaults';
import handleEtag from '../helper/etag';
import keyFactory from '../helper/key';

export default function setList(cache, options = {}) {
  options = defaults({}, options, {
    etag: true,
    list: null,
    total: ['where']
  });

  const write = Boolean(cache.channel());

  return (request, response, next) => {
    const listKey = keyFactory(request, options.list);
    const totalKey = keyFactory(request, options.total);
    const data = request.data();

    const tasks = {
      list: (callback) => cache.set(listKey, data.list, callback)
    };

    if (typeof response.header('x-total') !== 'number') {
      tasks.total = (callback) => cache.set(totalKey, data.total, callback);
    }

    parallel(tasks, (error, result) => {
      if (error) {
        next(error);
        return;
      }

      if (result.total) {
        response.header('x-total', result.total);
      }

      const etag = options.etag === true &&
        handleEtag(request, response, result.list, write);

      if (etag) {
        return;
      }

      if (write === true) {
        response.write(result.list);
      } else {
        response.end(result.list);
      }
    });
  };
}
