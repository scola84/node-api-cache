import md5 from 'crypto-js/md5';

export default function filterRespond(write = false) {
  return (request, response, next) => {
    const total = request.datum('total');

    const value = request.datum('list') ||
      request.datum('object');

    const hash = md5(JSON.stringify(value))
      .toString();

    let data = null;

    if (total !== null) {
      response.header('x-total', total.total);
    }

    if (request.header('x-etag') === hash) {
      response.status(304);
      data = '';
    } else {
      response.header('x-etag', hash);
      data = value;
    }

    if (write === true) {
      response.write(data);
    } else {
      response.end();
    }

    next();
  };
}
