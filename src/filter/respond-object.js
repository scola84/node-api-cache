import md5 from 'crypto-js/md5';

export default function respondObject(server, write = false) {
  return (request, response, next) => {
    const object = request.datum('object');
    const hash = md5(JSON.stringify(object))
      .toString();

    let data = null;

    if (request.header('x-etag') === hash) {
      response.status(304);
      data = '';
    } else {
      response.header('x-etag', hash);
      data = object;
    }

    if (write === true) {
      response.write(data);
    } else {
      response.end();
    }

    next();
  };
}
