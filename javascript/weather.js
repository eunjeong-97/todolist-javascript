import { WEATHER_API_KEY } from "../config.js";

const weather = document.querySelector("#weather-info p:first-child");
const city = document.querySelector("#weather-info p:last-child");
const sunrise = document.querySelector("#sun p:first-child");
const sunset = document.querySelector("#sun p:last-child");

function formatTime(time) {
  return `${String(time.getHours()).padStart(2, "0")}:${String(
    time.getMinutes()
  ).padStart(2, "0")}:${String(time.getSeconds()).padStart(2, "0")}`;
}

function success(position) {
  const lat = position.coords.latitude; // 위도
  const lon = position.coords.longitude; // 경도
  const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
  fetch(weatherURL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const sensibleTemperature = data.main.feels_like;
      const weatherDescription = data.weather["0"].main;
      const cityName = data.name;
      const sunriseTime = formatTime(new Date(data.sys.sunrise * 1000));
      const sunsetTime = formatTime(new Date(data.sys.sunset * 1000));
      weather.innerText = `${sensibleTemperature}° / ${weatherDescription}`;
      city.innerText = `Your Position is ${cityName}`;
      sunrise.innerText = `일출시간은 ${sunriseTime}입니다`;
      sunset.innerText = `일몰시간은 ${sunsetTime}입니다`;
    });
}
function fail() {
  alert("위치를 알아내는데 실패했습니다.");
}

navigator.geolocation.getCurrentPosition(success, fail);

