import handleEtag from '../etag';
import objectKeyFactory from './key';

export default function setObject(cache, options = {}) {
  const keyFactory = options.key || objectKeyFactory;
  const end = options.end === false ? false : true;
  const etag = options.etag === false ? false : true;

  return (request, response, next) => {
    const key = keyFactory(request);

    cache.set(key, request.data(), (error, object) => {
      if (error) {
        next(error);
        return;
      }

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
