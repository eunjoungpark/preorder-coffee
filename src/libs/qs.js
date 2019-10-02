import qs from 'qs';
export default function query(location) {
  return qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });
}
