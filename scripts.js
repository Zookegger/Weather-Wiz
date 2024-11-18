let cweatherData = null;
let fweatherData = null;
const apikey = '7effdcce5270c1da9c3d3d29c2afb106';


const form = document.getElementById('location');
const tempMode = document.getElementById('switchButton');
const displayMode = document.getElementById('displayMode');

async function getWeatherData(city) {
    const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
    const fahrenheitUrl = `${baseURL}?q=${city}&appid=${apikey}&units=imperial`;
    const celsiusUrl = `${baseURL}?q=${city}&appid=${apikey}&units=metric`;

    try {
        const fResponse = await fetch(fahrenheitUrl); 
        const cResponse = await fetch(celsiusUrl);

        if (!fResponse.ok) 
            throw new Error(`Network response was not ok` + fResponse.statusText);
        if (!cResponse.ok)
            throw new Error(`Network response was not ok` + cResponse.statusText);

        const fdata = await fResponse.json();
        const cdata = await cResponse.json();
        console.log('Weather Data (Celsius): ', fdata);
        console.log('Weather Data (Fahrenheit): ', cdata);

        fweatherData = fdata;
        cweatherData = cdata;
        renderWeatherData(fdata, cdata);
        // Show the Switches
        document.getElementById('switches').classList.remove('hidden');
    } catch (error) {
        console.error('Fetch Error:', error);
        document.getElementById('weather').innerHTML = '<p>Error fetching weather data</p>';
    }
}

function displayCelsiusNormalMode (data, capitalizedDescription) {
    document.getElementById('weather').innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <p>Temperatures: ${data.main.temp}°C</p>
        <p>Feels like: ${data.main.feels_like}°C</p> 
        <p>Weather: ${capitalizedDescription}</p>
    `;
}

function displayFahrenheitNormalMode(data, capitalizedDescription) {
    document.getElementById('weather').innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <p>Temperatures: ${data.main.temp}°F</p>
        <p>Feels like: ${data.main.feels_like}°F</p> 
        <p>Weather: ${capitalizedDescription}</p>
    `;
}

function displayCelsiusAdvanceMode(data, capitalizedDescription) {
    document.getElementById('weather').innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <p><span class="bold">Temperatures:</span> ${data.main.temp}°C</p>
        <p>Max Temperatures: ${data.main.temp_max}°C</p>
        <p>Min Temperatures: ${data.main.temp_min}°C</p>
        <p>Feels like: ${data.main.feels_like}°C</p> 
        <p>Weather: ${capitalizedDescription}</p>
        <p>Humidity: ${data.main.pressure} hPa</p>
        <p>Pressure: ${data.main.humidity}%</p>
        <p>Visibility: ~${(data.visibility / 1000).toFixed(0)} km </p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function displayFahrenheitAdvanceMode(data, capitalizedDescription) {
    document.getElementById('weather').innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <p><span class="bold">Temperatures:</span> ${data.main.temp}°F</p>
        <p>Max Temperatures: ${data.main.temp_max}°F</p>
        <p>Min Temperatures: ${data.main.temp_min}°F</p>
        <p>Feels like: ${data.main.feels_like}°F</p> 
        <p>Weather: ${capitalizedDescription}</p>
        <p>Humidity: ${data.main.pressure} hPa</p>
        <p>Pressure: ${data.main.humidity}%</p>
        <p>Visibility: ~${(data.visibility / 1000).toFixed(0)} km </p>
        <p>Wind Speed: ${data.wind.speed} mph</p>
    `;
}

function renderWeatherData(fdata, cdata) {
    const celsiusWeatherDescription = cdata.weather[0].description;
    const fahrenheitWeatherDescription = fdata.weather[0].description;
    const celsiusCapitalizedDescription = celsiusWeatherDescription.charAt(0).toUpperCase() + celsiusWeatherDescription.slice(1);
    const fahrenheitCapitalizedDescription = fahrenheitWeatherDescription.charAt(0).toUpperCase() + fahrenheitWeatherDescription.slice(1);

    console.log('Display mode: ' + displayMode.checked);
    console.log('Temperature mode: ' + tempMode.checked);
    if (!displayMode.checked){
        if (tempMode.checked) 
            displayFahrenheitNormalMode(fdata, fahrenheitCapitalizedDescription);
        else 
            displayCelsiusNormalMode(cdata, celsiusCapitalizedDescription);  
    }else{
        if (tempMode.checked) 
            displayFahrenheitAdvanceMode(fdata, fahrenheitCapitalizedDescription); 
        else 
            displayCelsiusAdvanceMode(cdata, celsiusCapitalizedDescription);
    }

    document.getElementById('weather').classList.add('bordered');
    document.getElementById('weather').classList.add('weather');
}

document.addEventListener('DOMContentLoaded', () => {
    // Get location data
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        // Trim trailing spaces
        let city = (document.getElementById('cityInput').value).trim();
        
        // Get weather info of that location
        if (city){
            getWeatherData(city);
        }
    });
    // Update temperature mode if it has been switched
    tempMode.addEventListener('change', () => {
        if (cweatherData && fweatherData){
            renderWeatherData(fweatherData, cweatherData);
        }
    });
    
    // Update display mode if it has been switched
    displayMode.addEventListener('change', () => {
        if (cweatherData && fweatherData){
            renderWeatherData(fweatherData, cweatherData);
        }
    });
});
