import defaults from 'lodash-es/defaults';
import handleEtag from '../etag';
import keyFactory from './key';

export default function getList(cache, options = {}) {
  options = defaults({}, options, {
    etag: true,
    list: null
  });

  const write = Boolean(cache.channel());

  return (request, response, next) => {
    const key = keyFactory(request, options.list);

    cache.get(key, (error, list) => {
      if (error) {
        next(error);
        return;
      }

      if (!list) {
        next();
        return;
      }

      cache.cache().emit('hit', request);

      const etag = options.etag === true &&
        handleEtag(request, response, list, write);

      if (etag) {
        return;
      }

      if (write === true) {
        response.write(list);
      } else {
        response.end(list);
      }
    });
  };
}
