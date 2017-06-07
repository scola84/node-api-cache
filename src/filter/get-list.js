export default function getList(server, formatKey = () => {},
  executeQuery = () => {}) {

  const cache = server.cache();
  const router = server.router();

  return (request, response, next) => {
    const key = formatKey(request);

    cache.get(...key, (getError, cacheList) => {
      if (getError instanceof Error === true) {
        next(router.error('500 invalid_query ' +
          getError.message));
        return;
      }

      if (cacheList !== null) {
        request.datum('list', cacheList);
        next();
        return;
      }

      executeQuery(request, (queryError, queryList) => {
        if (queryError instanceof Error === true) {
          next(router.error('500 invalid_query ' +
            queryError.message));
          return;
        }

        cache.set(...key, queryList, (setError) => {
          if (setError instanceof Error === true) {
            next(router.error('500 invalid_query ' +
              setError.message));
            return;
          }

          request.datum('list', queryList);
          next();
        });
      });
    });
  };
}
