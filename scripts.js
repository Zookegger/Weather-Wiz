let cweatherData = null;
let fweatherData = null;
const apikey = '7effdcce5270c1da9c3d3d29c2afb106';

/*
// function getCityCoordinate (city) {

// }

// async function getFiveDayThreeHourData() {
//     const baseURL = 'https://api.openweathermap.org/data/2.5/forecast';
//     const url = `${baseURL}?lat=${lat}&lon=${lon}&appid=${apikey}`;

//     try {
//         const response = await fetch(url);
//         if (!response.ok) 
//             throw new Error('Network response was not ok' + response.statusText);
        
//         const data = await response.json();
//         console.log('Weather Data: ', data);

//         weatherData = data;

//     } catch (error) {
//         console.error('Fetch Error:', error);
//         document.getElementById('weather').innerHTML = '<p>Error fetching weather data</p>';
//     }
// }
*/

async function getWeatherData(city) {
    const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
    const fahrenheitUrl = `${baseURL}?q=${city}&appid=${apikey}`;
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


function normalMode (data, capitalizedDescription) {
    document.getElementById('weather').innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <p>Temperatures: ${data.main.temp}°C</p>
        <p>Feels like: ${data.main.feels_like}°C</p> 
        <p>Weather: ${capitalizedDescription}</p>
    `;
}

function fahrenheitNormalMode(data, capitalizedDescription) {
    document.getElementById('weather').innerHTML = `
        <h2>Weather in ${data.name}</h2>
        <p>Temperatures: ${data.main.temp}°F</p>
        <p>Feels like: ${data.main.feels_like}°F</p> 
        <p>Weather: ${capitalizedDescription}</p>
    `;
}

function advanceMode(data, capitalizedDescription) {
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

function fahrenheitAdvanceMode(data, capitalizedDescription) {
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
        <p>Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function renderWeatherData(fdata, cdata) {
    const isAdvance = document.getElementById('advance').checked;
    const celsiusWeatherDescription = cdata.weather[0].description;
    const fahrenheitWeatherDescription = fdata.weather[0].description;
    const celsiusCapitalizedDescription = celsiusWeatherDescription.charAt(0).toUpperCase() + celsiusWeatherDescription.slice(1);
    const fahrenheitCapitalizedDescription = fahrenheitWeatherDescription.charAt(0).toUpperCase() + fahrenheitWeatherDescription.slice(1);
    const isFahrenheit = document.getElementById('fahrenheit').checked;

    if (!isAdvance){
        if (isFahrenheit) 
            fahrenheitNormalMode(fdata, fahrenheitCapitalizedDescription);
        else 
            normalMode(cdata, celsiusCapitalizedDescription);  
    }else{
        if (isFahrenheit) 
            fahrenheitAdvanceMode(fdata, fahrenheitCapitalizedDescription); 
        else 
            advanceMode(cdata, celsiusCapitalizedDescription);
    }

    document.getElementById('weather').classList.add('bordered');
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('location');
    const advanceMode = document.getElementById('advance');
    const fahrenheitMode = document.getElementById('fahrenheit');

    // Get location data
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const city = document.getElementById('cityInput').value;

        // Get weather info of that location
        if (city){
            getWeatherData(city);
        }
    });

    fahrenheitMode.addEventListener('change', () => {
        if (cweatherData && fweatherData){
            renderWeatherData(fweatherData, cweatherData);
        }
    });
    
    // Change to advance info mode
    advanceMode.addEventListener('change', () => {
        if (cweatherData && fweatherData){
            renderWeatherData(fweatherData, cweatherData);
        }
    });
});
