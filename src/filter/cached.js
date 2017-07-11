import { ScolaError } from '@scola/error';

export default function filterCached(cache, formatKey = () => {},
  executeQuery = () => {}, mode = 'object') {

  return (request, response, next) => {
    formatKey(mode, request, (key, field = null) => {
      cache.get(key, field, (getError, cacheValue) => {
        if (getError instanceof Error === true) {
          next(new ScolaError('500 invalid_query ' +
            getError.message));
          return;
        }

        if (cacheValue !== null) {
          request.datum(mode, cacheValue);
          next();
          return;
        }

        executeQuery(mode, request, (queryError, queryValue) => {
          if (queryError instanceof Error === true) {
            next(new ScolaError('500 invalid_query ' +
              queryError.message));
            return;
          }

          if (queryValue === null) {
            next();
            return;
          }

          if (mode !== 'list') {
            if (queryValue.length === 0) {
              next(new ScolaError('404 invalid_path ' +
                request.path()));
              return;
            }

            queryValue = queryValue[0];
          }

          cache.set(key, field, queryValue, (setError) => {
            if (setError instanceof Error === true) {
              next(new ScolaError('500 invalid_query ' +
                setError.message));
              return;
            }

            request.datum(mode, queryValue);
            next();
          });
        });
      });
    });
  };
}
