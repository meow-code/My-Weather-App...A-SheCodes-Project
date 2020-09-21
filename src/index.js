// Update HTML
let apiKey = "dd01abb9e9165de13b0e0f54a8ec984b";

let units = "imperial";
let latLocation = null;
let longLocation = null;

function displayData(response) {
  document.querySelector("#current-temp").innerHTML = Math.round(
    response.data.current.temp
  );
  document.querySelector("#current-condition").innerHTML =
    response.data.current.weather[0].main;
  document.querySelector("#current-wind").innerHTML = Math.round(
    response.data.current.wind_speed
  );
  document.querySelector("#current-humidity").innerHTML = Math.round(
    response.data.current.humidity
  );
  document.querySelector("#wind-units").innerHTML = " mph";
  let emojiElement = document.querySelector("#current-emoji");
  emojiElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`
  );
  emojiElement.setAttribute(
    "alt",
    response.data.current.weather[0].description
  );
  let dayForecast = new Date(response.data.daily[1].dt * 1000);
  let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  //console.log(days[new Date(forecast.dt.getDay()]);
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 1; index < 6; index++) {
    forecast = response.data.daily[index];
    forecastElement.innerHTML += `
  <div class="col p-0" style="max-width: 110px">
  <div class="card forecast">
    <div class="card-body p-0">
      <ul>
        <li class="blank">.</li>
        <li class="circle-day-row">${
          days[new Date(forecast.dt * 1000).getDay()]
        }</li>
        <li class="weatherEmoji">
          <img height="50" src="http://openweathermap.org/img/wn/${
            forecast.weather[0].icon
          }@2x.png"></img>
        </li>
        <li class="circle-temp-row"><strong>${Math.round(
          forecast.temp.max
        )}°</strong>/ ${Math.round(forecast.temp.min)}°</li>
        <li class="blank">.</li>
      </ul>
    </div>
  </div>
</div>`;
  }
}

// Error Message
function errorFunction(error) {
  alert(
    "Sorry the location you've entered does not exist.  Check your entry and try again."
  );
}

function useLocation(latLocation, longLocation) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latLocation}&lon=${longLocation}&
  exclude=hourly,daily&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayData);
}

//get the lat and long from searched city
function retrieveCoordinates(response) {
  document.querySelector("#current-city").innerHTML = `${response.data.name}`;
  document.querySelector(
    "#current-country"
  ).innerHTML = `, ${response.data.sys.country}`;
  longLocation = response.data.coord.lon;
  latLocation = response.data.coord.lat;
  useLocation(latLocation, longLocation);
}

//pull name via coordinates
function nameByCoordinates(latLocation, longLocation) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latLocation}&lon=${longLocation}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(retrieveCoordinates);
}

// pull Location datA
function searchCity(newLocation) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newLocation}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(retrieveCoordinates).catch(errorFunction);
}

function goFehrenheit() {
  document.querySelector("#fahrenheit-link").innerHTML =
    "<span style='color: #4f98ca; text-decoration: none'>°F</span>";
  document.querySelector("#celsius-link").innerHTML =
    "<span style='color: #ec6e4c; text-decoration: underline'>°C</span>";
  units = "imperial";
}

function goCelsius() {
  document.querySelector("#celsius-link").innerHTML =
    "<span style='color: #4f98ca; text-decoration: none'>°C</span>";
  document.querySelector("#fahrenheit-link").innerHTML =
    "<span style='color: #ec6e4c; text-decoration: underline'>°F</span>";
  document.querySelector("#wind-units").innerHTML = " km/h";
  units = "metric";
}

// Search bar Entry
function logCity(event) {
  event.preventDefault();
  goFehrenheit();
  searchCity(document.querySelector("#search-city-input").value);
}

// search event listener
document.querySelector("#search-city").addEventListener("submit", logCity);

// set current location
function showPosition(position) {
  longLocation = position.coords.longitude;
  latLocation = position.coords.latitude;
  nameByCoordinates(latLocation, longLocation);
}

function setGeolocation(event) {
  event.preventDefault();
  goFehrenheit();
  navigator.geolocation.getCurrentPosition(showPosition);
}

// button event listener FOR geolocation
document
  .querySelector("#set-current")
  .addEventListener("click", setGeolocation);

//date and time
let now = new Date();
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let hour = now.getHours();
let minute = now.getMinutes();
let ampm = "AM";

if (minute < 10) {
  minute = `0${minute}`;
}
if (hour > 12) {
  hour = hour - 12;
  ampm = "PM";
}

document.querySelector("#date-current").innerHTML = `${days[now.getDay()]}, ${
  months[now.getMonth()]
} ${now.getDate()}, ${now.getFullYear()} <br>${hour}:${minute} ${ampm}`;

// Toggle Fehrenheit
function toggleFahrenheit(event) {
  goFehrenheit();
  searchCity(document.querySelector("#current-city").innerHTML);
}

document
  .querySelector("#fahrenheit-link")
  .addEventListener("click", toggleFahrenheit);

// Toggle Celsius
function toggleCelsius(event) {
  event.preventDefault();
  goCelsius();
  searchCity(document.querySelector("#current-city").innerHTML, units);
}

document
  .querySelector("#celsius-link")
  .addEventListener("click", toggleCelsius);

goFehrenheit;
searchCity("baltimore");
