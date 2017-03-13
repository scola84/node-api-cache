import defaults from 'lodash-es/defaults';
import handleEtag from '../etag';
import keyFactory from './key';

export default function setObject(cache, options = {}) {
  options = defaults({}, options, {
    etag: true
  });

  const end = Boolean(cache.channel());

  return (request, response, next) => {
    const key = keyFactory(request);

    cache.set(key, request.data(), (error, object) => {
      if (error) {
        next(error);
        return;
      }

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
