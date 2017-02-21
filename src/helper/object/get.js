import handleEtag from '../etag';
import objectKeyFactory from './key';

export default function getObject(cache, options = {}) {
  const keyFactory = options.key || objectKeyFactory;
  const end = options.end === false ? false : true;
  const etag = options.etag === false ? false : true;

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

      if (etag && handleEtag(request, response, object, end)) {
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
