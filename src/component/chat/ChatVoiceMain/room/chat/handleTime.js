const handleTime = (time) => {
  const currentTime = new Date().getTime();
  const timeGap = currentTime - time;
  const day = Math.floor(timeGap / 86400000);
  const hour = Math.floor((timeGap - day*86400000) / 3600000);
  const min = Math.floor((timeGap - day*86400000 - hour*3600000) / 60000);
  const second = Math.floor((timeGap - day*86400000 - hour*3600000 - min*60000) / 1000);
  if(day > 0) return `Hơn ${day} ngày trước`;
  else if(hour > 0) return `Hơn ${hour} giờ trước`;
  else if(min > 0) return `Khoảng ${min} phút trước`;
  else return 'Vừa xong';
}

export default handleTime;