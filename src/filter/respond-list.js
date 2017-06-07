import md5 from 'crypto-js/md5';

export default function respondList(server, write = false) {
  return (request, response, next) => {
    const total = request.datum('total');
    const list = request.datum('list');
    const hash = md5(JSON.stringify(list))
      .toString();

    let data = null;

    response.header('x-total', total);

    if (request.header('x-etag') === hash) {
      response.status(304);
      data = '';
    } else {
      response.header('x-etag', hash);
      data = list;
    }

    if (write === true) {
      response.write(data);
    } else {
      response.end();
    }

    next();
  };
}
