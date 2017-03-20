import { MD5 } from 'object-hash';

export default function handleEtag(request, response, value, write) {
  const hash = MD5(value);

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
