import defaults from 'lodash-es/defaults';
import handleEtag from '../etag';
import keyFactory from './key';

export default function getObject(cache, options = {}) {
  options = defaults({}, options, {
    etag: true
  });

  const end = Boolean(cache.channel());

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
        handleEtag(request, response, object, end);

      if (etag) {
        return;
      }

      if (end === true) {
        response.end(object);
      } else {
        response.write(object);
      }
    });
  };
}
