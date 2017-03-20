import md5 from 'crypto-js/md5';

export default function handleEtag(request, response, value, write) {
  const hash = md5(JSON.stringify(value));

  if (request.header('x-etag') === hash) {
    response.status(304);

    if (write === true) {
      response.write('');
    } else {
      response.end();
    }

    return true;
  }

  response.header('x-etag', hash);
  return false;
}
