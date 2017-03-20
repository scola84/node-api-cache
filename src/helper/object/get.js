import defaults from 'lodash-es/defaults';
import handleEtag from '../etag';
import keyFactory from './key';

export default function getObject(cache, options = {}) {
  options = defaults({}, options, {
    etag: true
  });

  const write = Boolean(cache.channel());

  return (request, response, next) => {
    const key = keyFactory(request);

    cache.get(key, (error, object) => {
      if (error) {
        next(error);
        return;
      }

      if (!object) {
        next();
        return;
      }

      cache.cache().emit('hit', request);

      const etag = options.etag === true &&
        handleEtag(request, response, object, write);

      if (etag) {
        return;
      }

      if (write === true) {
        response.write(object);
      } else {
        response.end(object);
      }
    });
  };
}
