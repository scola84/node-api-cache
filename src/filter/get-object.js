export default function getObject(server, formatKey = () => {},
  executeQuery = () => {}) {

  const cache = server.cache();
  const router = server.router();

  return (request, response, next) => {
    const [key, field] = formatKey(request);

    cache.get(key, field, (getError, cacheObject) => {
      if (getError instanceof Error === true) {
        next(router.error('500 invalid_query ' +
          getError.message));
        return;
      }

      if (cacheObject !== null) {
        request.datum('object', cacheObject);
        next();
        return;
      }

      executeQuery(request, (queryError, queryObject) => {
        if (queryError instanceof Error === true) {
          next(router.error('500 invalid_query ' +
            queryError.message));
          return;
        }

        if (queryObject.length === 0) {
          next(router.error('404 invalid_path ' +
            request.path()));
          return;
        }

        queryObject = queryObject[0];

        cache.set(key, field, queryObject, (setError) => {
          if (setError instanceof Error === true) {
            next(router.error('500 invalid_query ' +
              setError.message));
            return;
          }

          request.datum('object', queryObject);
          next();
        });
      });
    });
  };
}
