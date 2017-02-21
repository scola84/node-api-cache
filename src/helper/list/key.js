export default function listKeyFactory(request) {
  return [
    request.path(),
    request.query('where'),
    request.query('order'),
    request.query('limit')
  ];
}
