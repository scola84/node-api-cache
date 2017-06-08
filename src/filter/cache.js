import { ScolaError } from '@scola/error';

export default function filterCache(cache, formatKey = () => {},
  executeQuery = () => {}) {

  return (request, response, next) => {
    const [name, key, field = null] = formatKey(request);

    cache.get(key, field, (getError, cacheValue) => {
      if (getError instanceof Error === true) {
        next(new ScolaError('500 invalid_query ' +
          getError.message));
        return;
      }

      if (cacheValue !== null) {
        request.datum(name, cacheValue);
        next();
        return;
      }

      executeQuery(request, (queryError, queryValue) => {
        if (queryError instanceof Error === true) {
          next(new ScolaError('500 invalid_query ' +
            queryError.message));
          return;
        }

        if (name !== 'list') {
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

          request.datum(name, queryValue);
          next();
        });
      });
    });
  };
}
