// Update HTML
let apiKey = "dd01abb9e9165de13b0e0f54a8ec984b";

let units = "imperial";
let latLocation = null;
let longLocation = null;

function displayData(response) {
  console.log(response);
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
  console.log(response);
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

// Search bar Entry
function logCity(event) {
  event.preventDefault();
  document.querySelector("#fahrenheit-link").innerHTML =
    "<span style='color: #4f98ca; text-decoration: none'>°F</span>";
  document.querySelector("#celsius-link").innerHTML =
    "<span style='color: #50d890; text-decoration: underline'>°C</span>";
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
  document.querySelector("#fahrenheit-link").innerHTML =
    "<span style='color: #4f98ca; text-decoration: none'>°F</span>";
  document.querySelector("#celsius-link").innerHTML =
    "<span style='color: #50d890; text-decoration: underline'>°C</span>";
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
  //event.preventDefault();
  document.querySelector("#fahrenheit-link").innerHTML =
    "<span style='color: #4f98ca; text-decoration: none'>°F</span>";
  document.querySelector("#celsius-link").innerHTML =
    "<span style='color: #50d890; text-decoration: underline'>°C</span>";
  document.querySelector("#wind-units").innerHTML = " mph";
  units = "imperial";
  searchCity(document.querySelector("#current-city").innerHTML);
}

document
  .querySelector("#fahrenheit-link")
  .addEventListener("click", toggleFahrenheit);

// Toggle Celsius
function toggleCelsius(event) {
  event.preventDefault();
  document.querySelector("#celsius-link").innerHTML =
    "<span style='color: #4f98ca; text-decoration: none'>°C</span>";
  document.querySelector("#fahrenheit-link").innerHTML =
    "<span style='color: #50d890; text-decoration: underline'>°F</span>";
  document.querySelector("#wind-units").innerHTML = " km/h";
  units = "metric";
  searchCity(document.querySelector("#current-city").innerHTML, units);
}

document
  .querySelector("#celsius-link")
  .addEventListener("click", toggleCelsius);
document.querySelector("#fahrenheit-link").innerHTML =
  "<span style='color: #4f98ca; text-decoration: none'>°F</span>";
document.querySelector("#celsius-link").innerHTML =
  "<span style='color: #50d890; text-decoration: underline'>°C</span>";

searchCity("baltimore");
