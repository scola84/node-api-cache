export default function totalKeyFactory(request) {
  return [
    request.path(),
    request.query('where')
  ];
}
