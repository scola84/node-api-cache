import defaults from 'lodash-es/defaults';
import handleEtag from '../etag';
import keyFactory from './key';

export default function setList(cache, options = {}) {
  options = defaults({}, options, {
    etag: true,
    list: null
  });

  const write = Boolean(cache.channel());

  return (request, response, next) => {
    const key = keyFactory(request, options.list);

    cache.set(key, request.data(), (error, list) => {
      if (error) {
        next(error);
        return;
      }

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
