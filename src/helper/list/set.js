import handleEtag from '../etag';
import listKeyFactory from './key';

export default function setList(cache, options = {}) {
  const keyFactory = options.key || listKeyFactory;
  const end = options.end === false ? false : true;
  const etag = options.etag === false ? false : true;

  return (request, response, next) => {
    const key = keyFactory(request);

    cache.set(key, request.data(), (error, list) => {
      if (error) {
        next(error);
        return;
      }

      if (etag && handleEtag(request, response, list, end)) {
        return;
      }

      if (end === true) {
        response.end(list);
      } else {
        response.write(list);
      }
    });
  };
}
