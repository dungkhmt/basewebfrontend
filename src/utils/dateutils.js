export function toFormattedDateTime(rawTime) {
  let date = new Date(rawTime);
  return date.getFullYear() +
    '-' +
    addZeroBefore(date.getMonth() + 1, 2) +
    '-' +
    addZeroBefore(date.getDate(), 2) +
    ' ' +
    addZeroBefore(date.getHours(), 2) +
    ":" +
    addZeroBefore(date.getMinutes(), 2) +
    ":" +
    addZeroBefore(date.getSeconds(), 2);
}

export function toFormattedTime(numberSeconds) {
  let hour = parseInt(numberSeconds / 3600);
  let minute = parseInt((numberSeconds / 60) % 60);
  let second = parseInt(numberSeconds % 60);
  return addZeroBefore(hour, 2) + ":" + addZeroBefore(minute, 2) + ":" + addZeroBefore(second, 2);
}

export function addZeroBefore(number, k) {
  return ('0' + number).slice(-k);
}