class Weather {
    constructor(data) {
        // Basic information
        this.city = data.city;
        this.description = data.description;
        this.icon = data.icon;

        // Temperature
        this.temperature = data.temperature;
        this.feels_like = data.feels_like;
        this.temp_min = data.temp_min;
        this.temp_max = data.temp_max;
        
        // Humidity
        this.humidity = data.humidity;
        
        // Wind
        this.windSpeed = data.windSpeed;
        this.windDeg = data.windDeg;

        // Pressure
        this.pressure = data.pressure;

        // Timestamp
        this.timestamp = new Date();
    }
    
    toJson() {
        return {
            city: this.city,
            description: this.description,
            temperature: this.temperature,
            feels_like: this.feels_like,
            temp_min: this.temp_min,
            temp_max: this.temp_max,
            humidity: this.humidity,
            windSpeed: this.windSpeed,
            windDirection: this.windDirection,
            pressure :this.pressure,
            timestamp: this.timestamp 
        };
    }
}

module.exports = Weather;