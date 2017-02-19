import { sha1 } from 'object-hash';

export default function totalKeyFactory(request) {
  return sha1([
    request.path(),
    request.query('where')
  ]);
}
