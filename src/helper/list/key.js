import { sha1 } from 'object-hash';

export default function listKeyFactory(request) {
  return sha1([
    request.path(),
    request.query('where'),
    request.query('order'),
    request.query('limit')
  ]);
}
