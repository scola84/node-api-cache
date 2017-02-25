import pick from 'lodash-es/pick';

export default function listKeyFactory(request, fields) {
  return [
    request.path(),
    pick(request.query(), fields)
  ];
}
