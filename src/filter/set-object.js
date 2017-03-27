import defaults from 'lodash-es/defaults';
import handleEtag from '../helper/etag';
import keyFactory from '../helper/key';

export default function setObject(cache, options = {}) {
  options = defaults({}, options, {
    etag: true
  });

  const write = Boolean(cache.channel());

  return (request, response, next) => {
    const key = keyFactory(request, []);
    const data = request.data();

    cache.set(key, data.object, (error, object) => {
      if (error instanceof Error === true) {
        next(error);
        return;
      }

      const etag =
        options.etag === true &&
        handleEtag(request, response, object, write) === true;

      if (etag === true) {
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
