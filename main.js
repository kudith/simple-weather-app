const apiKey = "bcdb9b0a39e5bafa089c37d2bc504365";

function handleKeyPress(event) {
  if (event.key === "Enter") {
    getWeatherByCity();
  }
}

async function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  if (!city) {
    alert("Please enter a city name!");
    return;
  }
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city
      )}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    const weatherElement = document.getElementById("weather");
    weatherElement.innerHTML = `
  <p class="text-3xl">Failed to load weather data</p>
  <p class="text-xl">${error.message}</p>`;
  }
}

async function getWeatherByLocation(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("Failed to get weather data");
    }
    const data = await response.json();
    const cityName = await getCityName(lat, lon);
    displayWeather(data, cityName);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    const weatherElement = document.getElementById("weather");
    weatherElement.innerHTML = `
  <p class="text-3xl">Failed to load weather data</p>
  <p class="text-xl">${error.message}</p>`;
  }
}

async function getCityName(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    if (!response.ok) {
      throw new Error("Failed to get city name");
    }
    const data = await response.json();
    return (
      data.address.city ||
      data.address.town ||
      data.address.village ||
      "Unknown City"
    );
  } catch (error) {
    console.error("Error fetching city name:", error);
    return "Unknown City";
  }
}

function displayWeather(data) {
  const weatherElement = document.getElementById("weather");
  const weatherDescription = data.weather[0].description;
  const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  weatherElement.innerHTML = `
<div class="animate-weather">
  <p class="text-4xl font-bold">${data.name}</p>
  <img class="weather-icon" src="${weatherIcon}" alt="${weatherDescription}">
  <p class="text-6xl font-extrabold">${data.main.temp.toFixed(2)}°C</p>
  <p class="text-xl capitalize">${weatherDescription}</p>
</div>
`;
  document.getElementById("cityInput").value = data.name;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByLocation(lat, lon);
      },
      () => {
        const weatherElement = document.getElementById("weather");
        weatherElement.innerHTML = `<p class="text-3xl">Failed to get your location</p>`;
      }
    );
  } else {
    const weatherElement = document.getElementById("weather");
    weatherElement.innerHTML = `<p class="text-3xl">Geolocation is not supported by this browser</p>`;
  }
}

document.addEventListener("DOMContentLoaded", getLocation);