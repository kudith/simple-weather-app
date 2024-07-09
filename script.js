const apiKey = import.meta.env.VITE_API_KEY;

export function handleKeyPress(event) {
  if (event.key === 'Enter') {
    getWeatherByCity();
  }
}

export async function getWeatherByCity() {
  const city = document.getElementById('cityInput').value.trim();
  if (!city) {
    alert('Please enter a city name!');
    return;
  }
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error('City not found');
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    displayError(error.message);
  }
}

export async function getWeatherByLocation(lat, lon) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error('Failed to get weather data');
    }
    const data = await response.json();
    const cityName = await getCityName(lat, lon);
    displayWeather(data, cityName);
  } catch (error) {
    displayError(error.message);
  }
}

async function getCityName(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    if (!response.ok) {
      throw new Error('Failed to get city name');
    }
    const data = await response.json();
    return (
      data.address.city ||
      data.address.town ||
      data.address.village ||
      'Unknown City'
    );
  } catch (error) {
    console.error('Error fetching city name:', error);
    return 'Unknown City';
  }
}

function displayWeather(data, city) {
  const weatherElement = document.getElementById('weather');
  const weatherDescription = data.weather[0].description;
  const weatherIconCode = data.weather[0].icon;
  const weatherIconUrl = `https://openweathermap.org/img/wn/${weatherIconCode}@2x.png`;
  weatherElement.innerHTML = `
    <div class="animate-weather">
      <p class="text-4xl font-bold">${city || data.name}</p>
      <img class="weather-icon" src="${weatherIconUrl}" alt="${weatherDescription}">
      <p class="text-6xl font-extrabold">${data.main.temp.toFixed(2)}°C</p>
      <p class="text-xl capitalize">${weatherDescription}</p>
    </div>
  `;
  document.getElementById('cityInput').value = data.name;
}

function displayError(message) {
  const weatherElement = document.getElementById('weather');
  weatherElement.innerHTML = `
    <p class="text-3xl">Failed to load weather data</p>
    <p class="text-xl">${message}</p>
  `;
}

export function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        getWeatherByLocation(lat, lon);
      },
      () => {
        displayError('Failed to get your location');
      }
    );
  } else {
    displayError('Geolocation is not supported by this browser');
  }
}

document.addEventListener('DOMContentLoaded', getLocation);
