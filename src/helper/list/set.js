import handleEtag from '../etag';
import keyFactory from './key';

export default function setList(cache, options = {}) {
  const end = options.end === false ? false : true;
  const etag = options.etag === false ? false : true;
  const fields = options.list ? options.list : null;

  return (request, response, next) => {
    const key = keyFactory(request, fields);

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
