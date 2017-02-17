export default function readListCache(cache, end = true) {
  return (request, response, next) => {
    cache.read(request, (error, list, total) => {
      if (error) {
        next(error);
        return;
      }

      if (typeof total === 'number') {
        response.header('x-total', total);
      }

      if (list) {
        if (end === true) {
          response.end(list);
        } else {
          response.write(list);
        }

        return;
      }

      next();
    });
  };
}
