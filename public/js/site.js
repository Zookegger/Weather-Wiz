const temperatureLevels = [
	{ max: 0, label: `<i class="bi bi-thermometer-snow"></i>` },
	{ max: 5, label: `<i class="fa-solid fa-temperature-empty"></i>` },
	{ max: 10, label: `<i class="fa-solid fa-temperature-low"></i>` },
	{ max: 15, label: `<i class="fa-solid fa-temperature-quarter"></i>` },
	{ max: 20, label: `<i class="fa-solid fa-temperature-half"></i>` },
	{ max: 25, label: `<i class="fa-solid fa-temperature-three-quarters"></i>`},
	{ max: 30, label: `<i class="fa-solid fa-temperature-high"></i>` },
	{ max: 35, label: `<i class="bi bi-thermometer-sun"></i>` },
];

/**
 * Get an icon based on the temperature value
 * @param {number} celsius - Temperature in Celsius
 * @returns {string} - HTML string with appropriate temperature icon
 */
function getTemperatureRating(celsius) {
	const level = temperatureLevels.find((l) => celsius <= l.max);
	return level ? level.label : `<i class="fa-solid fa-temperature-full"></i>`;
}

/**
 * Handle map updates when city search occurs
 * @param {string} city - Name of the city to show on map
 */
function updateMap(city) {
	if (typeof window.updateMapForCity === "function" && city) {
		window.updateMapForCity(city);
	}
}

class Weather {
	#iconUrl = `https://openweathermap.org/img/wn`;
	#iconUrlEnd = `@2x.png`;

	appendData(response) {
        
        $("#loading").toggleClass("d-none");
        
		$("#content").empty();

		const data = response.data;

		let content = null;
		if (!data) {
			content = `<span class=''>No data found</span>`;
		} else {
			let temperature = data.temperature;
			let tempIcon = getTemperatureRating(temperature);
			let description = data.description;

			let metricContent = `
                    <div class="card-header fw-bold h2 bg-secondary-subtle d-flex align-items-center justify-content-between">
                        <span>${data.city}</span>
                        <small class="text-muted fs-6">Last updated: ${new Date(
							data.timestamp
						).toLocaleString()}</small>
                    </div>
                    <div class="card-body">
                        <div class='row justify-content-arround mx-auto'>
                            <div class='col-6 d-flex justify-content-center align-items-center flex-column'>
                                <div class="display-4 fw-bold mb-2">${tempIcon} ${data.temperature}°C</div>
                                <div class="fs-5 text-muted">Feels like ${data.feels_like}°C</div>
                            </div>
                            <div class='col-6 justify-content-center text-center rounded-4 p-2' 
                            style='
                                background: rgba(217, 217, 217, 0.55);
                                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                                backdrop-filter: blur(15.2px);
                                -webkit-backdrop-filter: blur(15.2px);
                                border: 1px solid rgba(217, 217, 217, 0.3);
                            '>
                                <img src='${this.#iconUrl}/${data.icon}${this.#iconUrlEnd}' 
                                    width=120px height=120px 
                                    class="drop-shadow img-fluid"
                                    alt="weather icon">
                                <div class="fs-3 fw-semibold mt-2 text-dark">
                                    ${description}
                                </div>
                            </div>
                        </div>
                        <div class="row g-4 mt-2">
                            <div class="col-md-6 col-12">
                                <div class="p-3 bg-light rounded-3 d-flex align-items-center">
                                    <i class="bi bi-moisture fs-3 me-3 text-primary"></i>
                                    <div>
                                        <div class="text-muted">Humidity</div>
                                        <div class="fs-4 fw-semibold">${data.humidity}%</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6 col-12">
                                <div class="p-3 bg-light rounded-3 d-flex align-items-center">
                                    <i class="fa-solid fa-wind fs-3 me-3 text-primary"></i>
                                    <div>
                                        <div class="text-muted">Wind Speed</div>
                                        <div class="fs-4 fw-semibold">${data.windSpeed} m/s</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row row-cols-1 row-cols-md-2 g-4 mt-2">
                            <div class="col">
                                <div class="p-3 bg-light rounded-3 d-flex align-items-center">
                                    <i class="bi bi-moisture fs-3 me-3 text-primary"></i>
                                    <div>
                                        <div class="text-muted">Pressure</div>
                                        <div class="fs-4 fw-semibold">${data.pressure}hPa</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="p-3 bg-light rounded-3 d-flex align-items-center">
                                    <i class="fa-solid fa-wind fs-3 me-3 text-primary"></i>
                                    <div>
                                        <div class="text-muted">Wind Direction</div>
                                        <div class="fs-4 fw-semibold">${data.windDeg}°</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

			let imperialContent = `
                <div class="card-header fw-bold h2 bg-secondary-subtle d-flex align-items-center justify-content-between">
                    <span>${data.city}</span>
                    <small class="text-muted fs-6">Last updated: ${new Date(
						data.timestamp
					).toLocaleString()}</small>
                </div>
                <div class="card-body">
                    <div class='row justify-content-arround mx-auto'>
                        <div class='col-6 d-flex justify-content-center align-items-center flex-column'>
                            <div class="display-4 fw-bold mb-2">${tempIcon} ${
                                data.temperature
                            }°F</div>
                            <div class="fs-5 text-muted">Feels like ${
								data.feels_like
							}°F</div>
                        </div>
                        <div class='col-6 justify-content-center text-center rounded-4 p-2' 
                        style='
                            background: rgba(217, 217, 217, 0.55);
                            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                            backdrop-filter: blur(15.2px);
                            -webkit-backdrop-filter: blur(15.2px);
                            border: 1px solid rgba(217, 217, 217, 0.3);
                        '>
                            <img src='${this.#iconUrl}/${data.icon}${this.#iconUrlEnd}' 
                                width=120px height=120px 
                                class="drop-shadow img-fluid"
                                alt="weather icon">
                            <div class="fs-3 fw-semibold mt-2 text-dark">
                                ${description}
                            </div>
                        </div>
                    </div>
                    <div class="row g-4 mt-2">
                        <div class="col-md-6 col-12">
                            <div class="p-3 bg-light rounded-3 d-flex align-items-center">
                                <i class="bi bi-moisture fs-3 me-3 text-primary"></i>
                                <div>
                                    <div class="text-muted">Humidity</div>
                                    <div class="fs-4 fw-semibold">${
										data.humidity
									}%</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-12">
                            <div class="p-3 bg-light rounded-3 d-flex align-items-center">
                                <i class="fa-solid fa-wind fs-3 me-3 text-primary"></i>
                                <div>
                                    <div class="text-muted">Wind Speed</div>
                                    <div class="fs-4 fw-semibold">${
										data.windSpeed
									} mph</div>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div class="row row-cols-1 row-cols-md-2 g-4 mt-2">
                            <div class="col">
                                <div class="p-3 bg-light rounded-3 d-flex align-items-center">
                                    <i class="bi bi-moisture fs-3 me-3 text-primary"></i>
                                    <div>
                                        <div class="text-muted">Pressure</div>
                                        <div class="fs-4 fw-semibold">${
											data.pressure
										}hPa</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="p-3 bg-light rounded-3 d-flex align-items-center">
                                    <i class="fa-solid fa-wind fs-3 me-3 text-primary"></i>
                                    <div>
                                        <div class="text-muted">Wind Direction</div>
                                        <div class="fs-4 fw-semibold">${
											data.windDeg
										}°</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

			description = description
				.split(". ")
				.map((s) => s.charAt(0).toUpperCase() + s.slice(1))
				.join(". ");
			content = $("#units").prop("checked")
				? metricContent
				: imperialContent;
		}

		$("#content").append(content);

        // Hide loading spinner
        $("#loading").toggleClass("d-none");

        // Make content visible
        $("#content").removeClass("d-none");
        $("#content").addClass("d-flex");
	}

    showError(xhr, status, err) {
        const message = "Ab unexpected error occurred.";

        const response = JSON.parse(xhr.responseText);
        if (response.message) {
            message = response.message;
        }
        message = err;

        const errorHtml = `
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                ${(message =
                    message != null
                        ? message
                        : "An error has occured!")}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        $("#content").append(errorHtml);
        console.error("AJAX status:", status);
        console.error("AJAX error:", message);

        // Hide loading spinner
        $("#loading").toggleClass("d-none");

        // Make content visible
        $("#content").removeClass("d-none");
        $("#content").addClass("d-flex");
    }

	getData(city) {
		try {
            // True = Metric
            // False = Imperial
            let units = $("#units").prop("checked") ? "metric" : "imperial";
        
            // Store reference to 'this' to use inside callbacks
            const self = this;
            
            $.ajax({
                url:
                    window.location.origin +
                    "/api/weather/?city=" +
                    encodeURI(
                        city.normalize("NFD").replace(/[\u0300-\u036f]/g, "") +
                            "&units=" +
                            encodeURI(units)
                    ),

                success: function (response) {
                    self.appendData(response);
                },

                // xhr – the full XMLHttpRequest object (can inspect responseText, status, etc.)
                // status – a string describing the type of error ("timeout", "error", "abort", "parsererror")
                // errorThrown – the textual portion of the HTTP status, like "Not Found" or the exception message
                error: function (xhr, status, err) {
                    self.showError(xhr, status, err);
                },
			});
		} catch (error) {
			console.error(error);
            $("#loading").addClass("d-none");
            $("#content").removeClass("d-none");
            this.showError(null, "error", error.message);
		}
	}
}