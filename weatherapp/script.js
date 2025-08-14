// --- DOM Elements ---
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherContainer = document.getElementById('weather-container');
const currentWeatherEl = document.getElementById('current-weather');
const forecastContainerEl = document.getElementById('forecast-container');

// --- API Details from WeatherAPI.com ---
const API_KEY = 'b9a8a10528614e2da45214548251408'; // Your provided API key
const API_URL = 'https://api.weatherapi.com/v1/forecast.json';

// --- Event Listeners ---
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name.');
    }
}

async function getWeatherData(city) {
    // Show loading state
    currentWeatherEl.innerHTML = `<p class="initial-text">Loading...</p>`;
    forecastContainerEl.innerHTML = '';
    weatherContainer.style.display = 'block';

    try {
        // Fetch data for 7 days
        const response = await fetch(`${API_URL}?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error.message || 'City not found.');
        }

        const data = await response.json();
        
        displayCurrentWeather(data);
        displayForecast(data);

    } catch (error) {
        console.error('Error fetching weather data:', error);
        currentWeatherEl.innerHTML = `<p class="error-text">⚠️ Error: ${error.message}</p>`;
        forecastContainerEl.innerHTML = '';
    }
}

function displayCurrentWeather(data) {
    const { location, current } = data;
    currentWeatherEl.innerHTML = `
        <h2 class="city-name">${location.name}, ${location.country}</h2>
        <img class="weather-icon" src="https:${current.condition.icon}" alt="${current.condition.text}">
        <p class="temperature">${Math.round(current.temp_c)}<span>°C</span></p>
        <p class="description">${current.condition.text}</p>
        <div class="details">
            <div class="detail-item">
                <img src="https://i.ibb.co/6wF0z1M/humidity.png" alt="humidity icon">
                <div>
                    <p>Humidity</p>
                    <span>${current.humidity}%</span>
                </div>
            </div>
            <div class="detail-item">
                <img src="https://i.ibb.co/RzDbv4D/wind.png" alt="wind icon">
                <div>
                    <p>Wind Speed</p>
                    <span>${current.wind_kph.toFixed(1)} km/h</span>
                </div>
            </div>
        </div>
    `;
}

function displayForecast(data) {
    forecastContainerEl.innerHTML = ''; // Clear previous forecast

    const forecastDays = data.forecast.forecastday;

    // Skip the first day (today) as it's already displayed
    for (let i = 0; i < forecastDays.length; i++) {
        const dayData = forecastDays[i];
        
        // Format date to a short day name (e.g., 'Tue')
        const date = new Date(dayData.date);
        date.setDate(date.getDate() + 1); // Fix for timezone issues
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <p class="day">${dayName}</p>
            <img src="https:${dayData.day.condition.icon}" alt="${dayData.day.condition.text}">
            <p class="temp">${Math.round(dayData.day.maxtemp_c)}°</p>
        `;
        forecastContainerEl.appendChild(forecastCard);
    }
}