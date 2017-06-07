export default function getTotal(server, formatKey = () => {},
  executeQuery = () => {}) {

  const cache = server.cache();
  const router = server.router();

  return (request, response, next) => {
    const [key, field] = formatKey(request);

    cache.get(key, field, (getError, cacheTotal) => {
      if (getError instanceof Error === true) {
        next(router.error('500 invalid_query ' +
          getError.message));
        return;
      }

      if (cacheTotal !== null) {
        request.datum('total', cacheTotal);
        next();
        return;
      }

      executeQuery(request, (queryError, queryTotal) => {
        if (queryError instanceof Error === true) {
          next(router.error('500 invalid_query ' +
            queryError.message));
          return;
        }

        if (queryTotal.length === 0) {
          next(router.error('404 invalid_path ' +
            request.path()));
          return;
        }

        queryTotal = queryTotal[0].total;

        cache.set(key, field, queryTotal, (setError) => {
          if (setError instanceof Error === true) {
            next(router.error('500 invalid_query ' +
              setError.message));
            return;
          }

          request.datum('total', queryTotal);
          next();
        });
      });
    });
  };
}
