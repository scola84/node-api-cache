import pick from 'lodash-es/pick';

export default function keyFactory(request, fields = null) {
  return [
    request.path(),
    fields === null ? request.query() : pick(request.query(), fields)
  ];
}
