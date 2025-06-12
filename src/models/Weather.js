class Weather {
    constructor(data) {
        this.city = data.city;
        this.temperature = data.temperature;
        this.description = data.description;
        this.humidity = data.humidity;
        this.windSpeed = data.windSpeed;
        this.timestamp = new Date();
    }
    
    toJson() {
        return {
            city: this.city,
            temperature: this.temperature,
            description: this.description,
            humidity: this.humidity,
            windSpeed: this.windSpeed,
            timestamp: this.timestamp 
        };
    }
}

module.exports = Weather;