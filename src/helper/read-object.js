export default function readObjectCache(cache, end = true) {
  return (request, response, next) => {
    cache.read(request, (error, object) => {
      if (error) {
        next(error);
        return;
      }

      if (object) {
        if (end === true) {
          response.end(object);
        } else {
          response.write(object);
        }

        return;
      }

      next();
    });
  };
}
