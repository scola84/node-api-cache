import { MD5 } from 'object-hash';

export default function handleEtag(request, response, value, end) {
  const hash = MD5(value);

  if (request.header('x-etag') === hash) {
    response.status(304);

    if (end === true) {
      response.end();
    } else {
      response.write('');
    }

    return true;
  }

  response.header('x-etag', hash);
  return false;
}
