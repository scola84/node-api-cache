export default function writeObjectCache(cache, end = true) {
  return (request, response, next) => {
    const value = request.data();

    cache.write(request, value, (error, object) => {
      if (error) {
        next(error);
        return;
      }

      if (end === true) {
        response.end(object);
      } else {
        response.write(object);
      }
    });
  };
}
