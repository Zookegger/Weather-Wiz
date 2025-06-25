// Global map variable to be used throughout the application
let map = null;
let marker = null;

/**
 * Initializes the Leaflet map in the 'map' container
 * @param {Array} center - [latitude, longitude] coordinates for initial center
 * @param {number} zoom - Initial zoom level
**/

function initializeMap(center = [0, 0], zoom = 2) {
	// Create map if it doesn't exist
	if (!map) {
		map = L.map("map").setView(center, zoom);

		// Add OpenStreetMap tile layer
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			maxZoom: 19,
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		}).addTo(map);
	} else {
		// If map exists, just update the view
		map.setView(center, zoom);
	}
}

/**
 * Fetches weather data for the given coordinates
 * @param {Object} coordinates - The coordinates object containing lat and lng properties
 * @returns {Promise} - Promise that resolves with the weather data
 */
async function getData(coordinates) {
    try {
        // Show loading indicator (if it exists)
        if ($("#loading").length) {
            $("#loading").removeClass("d-none");
        }

        // Get the preferred units from the toggle (if it exists)
        let units = "metric"; // Default to metric
        if ($("#units").length) {
            units = $("#units").prop("checked") ? "metric" : "imperial";
        }

        // Build the API URL with coordinates and units
        const url = `${window.location.origin}/api/weather/?lat=${coordinates.lat}&lon=${coordinates.lng}&units=${units}`;
        
        // Fetch data from the API
        const response = await fetch(url);
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        
        // Parse the JSON response data
        const data = await response.json();
        
        // Log the data to console for debugging
        console.log("Weather data received:", data);
        
		// If we have a content area and the Weather class, update the UI
		if ($("#content").length && typeof Weather !== 'undefined') {
			// Create a new instance of the Weather class
			const weather_display = new Weather();
			// Pass the data to the Weather instance to update the UI
			weather_display.appendData(data);
		}
        
        // Update marker popup with weather info
        if (marker && data.success && data.data) {
            const weatherData = data.data;
            // const tempUnit = units === "metric" ? "°C" : "°F";
            
            // // Create popup content with weather information
            // const popupContent = `
            //     <div class="weather-popup">
            //         <h4>${weatherData.city || 'Current Location'}</h4>
            //         <p><strong>${weatherData.temperature}${tempUnit}</strong> - ${weatherData.description}</p>
            //     </div>
            // `;
            
            // Update the marker popup
            // marker.bindPopup(popupContent).openPopup();
        }
        
        // Hide loading indicator (if it exists)
        if ($("#loading").length) {
            $("#loading").addClass("d-none");
        }
        
        return data;
    } catch (error) {
        // Log the error for debugging
        console.error("Error getting weather data:", error);
        
        // Show error in marker popup
        if (marker) {
            marker.bindPopup(`<div class="text-danger">Error loading weather data</div>`).openPopup();
        }
        
        // Hide loading indicator (if it exists)
        if ($("#loading").length) {
            $("#loading").addClass("d-none");
        }
        
        // Rethrow the error for caller to handle if needed
        throw error;
    }
}

/**
 * Sets a marker at the specified location on the map
 * @param {Array} location - [latitude, longitude] coordinates
 * @param {string} popupText - Optional text to display in marker popup
**/

function setMarker(location = [0,0], popupText = "") {
	// Remove existing marker if present
	if (marker) {
		map.removeLayer(marker);
	}

	// Create new marker
	marker = L.marker(location);
	marker.options.draggable = true;
	
	marker.addEventListener("dragend", async function () {
		let coordinates = this.getLatLng();
		if (!coordinates) {
			console.error('Error: No coordinates');
		}
		try {
			const data = await getData(coordinates);
			const weatherApp = new Weather();
			// Check if Weather class is available before using it
			if (typeof Weather === 'undefined') {
				console.error('Weather class is not defined');
				return;
			}
			weatherApp.appendData(data);
		} catch (error) {
			console.error('An error has occured: ', error);
		}
	});

	// Add marker to map
	marker.addTo(map);
}

function getMarker() {
	if (marker) {
		return;
	}

	throw new NotImplementedException();
}

/**
 * Updates the map with location data from a city search
 * @param {string} city - Name of the city
**/
async function updateMapForCity(city) {
	try {
		// Make API request to get map data
		const response = await fetch(
			`${window.location.origin}/api/map/${encodeURIComponent(city)}`
		);
		const data = await response.json();

		if (data.success && data.data) {
			const { name, coordinates } = data.data;
			const { latitude, longitude } = coordinates;

			// If map doesn't exist yet, initialize it
			if (!map) {
				initializeMap([latitude, longitude], 10);
			} else {
				// Otherwise just update the view
				map.setView([latitude, longitude], 10);
			}

			// Set marker at the location
			setMarker([latitude, longitude], name);

			// Make map container visible
			document.querySelector(".map-container").classList.remove("d-none");
		} else {
			console.error(
				"Failed to get map data:",
				data.message || "Unknown error"
			);
		}
	} catch (error) {
		console.error("Error updating map:", error);
	}
}

// Expose the updateMapForCity function to the global scope
window.updateMapForCity = updateMapForCity;
