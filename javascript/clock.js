const clock = document.querySelector('#clock');
const todayDate = document.querySelector('#clock p:first-child');
const nowTime = document.querySelector('#clock p:last-child');

function formatDate(time) {
  return `${String(time.getFullYear())}년 ${String(
    time.getMonth() + 1
  ).padStart(2, '0')}월 ${String(time.getDate()).padStart(2, '0')}일`;
}

function formatTime(time) {
  return `${String(time.getHours()).padStart(2, '0')}:${String(
    time.getMinutes()
  ).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;
}

function showClock() {
  // 이 date object를 매번 생성해야 업데이트된다!!!
  const date = new Date();
  const weekdayArray = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdayArray[date.getDay()];
  todayDate.innerText = `${formatDate(date)} ${weekday}요일`;
  nowTime.innerText = formatTime(date);
}

showClock();
setInterval(showClock, 1000);
