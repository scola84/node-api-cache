import defaults from 'lodash-es/defaults';
import handleEtag from '../helper/etag';
import keyFactory from '../helper/key';

export default function getObject(cache, options = {}) {
  options = defaults({}, options, {
    etag: true
  });

  const write = Boolean(cache.channel());

  return (request, response, next) => {
    const key = keyFactory(request, []);

    cache.object(key, (error, object) => {
      if (error) {
        next(error);
        return;
      }

      const result = {
        object
      };

      request.data(result);

      if (!result.object) {
        next();
        return;
      }

      cache.factory().emit('hit', request);

      const etag = options.etag === true &&
        handleEtag(request, response, result.object, write);

      if (etag) {
        next();
        return;
      }

      if (write === true) {
        response.write(result.object);
      } else {
        response.end(result.object);
      }

      next();
    });
  };
}