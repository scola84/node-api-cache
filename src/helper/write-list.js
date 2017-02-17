export default function writeListCache(cache, end = true) {
  return (request, response, next) => {
    const value = request.data();
    const writeTotal = typeof response.header('x-total') !== 'number';

    cache.write(request, value, writeTotal, (error, list, total) => {
      if (error) {
        next(error);
        return;
      }

      if (typeof total === 'number') {
        response.header('x-total', total);
      }

      if (end === true) {
        response.end(list);
      } else {
        response.write(list);
      }
    });
  };
}
