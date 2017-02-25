import pick from 'lodash-es/pick';

export default function listKeyFactory(request, fields) {
  return [
    request.path(),
    fields ? pick(request.query(), fields) : request.query()
  ];
}
