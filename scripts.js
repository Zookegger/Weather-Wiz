let weatherData = null;

async function getWeatherData(city) {
    const apikey = '7effdcce5270c1da9c3d3d29c2afb106';
    const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
    const url = `${baseURL}?q=${city}&appid=${apikey}&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok` + response.statusText);
        }
        const data = await response.json();
        console.log('Weather Data: ', data);

        weatherData = data;
        renderWeatherData(data);
    } catch (error) {
        console.error('Fetch Error:', error);
        document.getElementById('weather').innerHTML = '<p>Error fetching weather data</p>';
    }
}

function renderWeatherData(data) {
    const isAdvance = document.getElementById('advance').checked;
    const weatherDescription = data.weather[0].description;
    const capitalizedDescription = weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1);

    if (!isAdvance){
        document.getElementById('weather').innerHTML = `
            <h2>Weather in ${data.name}</h2>
            <p>Temperatures: ${data.main.temp}°C</p>
            <p>Feels like: ${data.main.feels_like}°C</p> 
            <p>Weather: ${capitalizedDescription}</p>
        `;
    }
    else{
        document.getElementById('weather').innerHTML = `
            <h2>Weather in ${data.name}</h2>
            <p><span class="bold">Temperatures:</span> ${data.main.temp}°C</p>
            <p>Max Temperatures: ${data.main.temp_max}°C</p>
            <p>Min Temperatures: ${data.main.temp_min}°C</p>
            <p>Feels like: ${data.main.feels_like} °C</p> 
            <p>Weather: ${capitalizedDescription}</p>
            <p>Humidity: ${data.main.pressure} hPa</p>
            <p>Pressure: ${data.main.humidity}%</p>
            <p>Visibility: ~${(data.visibility / 1000).toFixed(0)} km </p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    }

    document.getElementById('weather').classList.add('bordered');
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('location');
    const advanceModeCheckbox = document.getElementById('advance');

    // Get location data
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const city = document.getElementById('cityInput').value;

        // Get weather info of that location
        if (city){
            getWeatherData(city);
        }
    });

    // Change to advance info mode
    advanceModeCheckbox.addEventListener('change', () => {
        if (weatherData)
            renderWeatherData(weatherData);
    });
});
