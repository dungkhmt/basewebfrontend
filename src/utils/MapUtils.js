export function parseLatLng(s) {
  let array = s.split(`,`);
  return [parseFloat(array[0]), parseFloat(array[1])];
}
