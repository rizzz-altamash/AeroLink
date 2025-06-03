// lib/weather-service.js
export class WeatherService {
  static async getWeatherByCity(city, state, country = 'US') {
    try {
      // You'll need to get an API key from https://openweathermap.org/api
      const API_KEY = process.env.OPENWEATHER_API_KEY;

      console.log('Weather API Key loaded:', process.env.OPENWEATHER_API_KEY ? 'Yes' : 'No');
      
      if (!API_KEY) {
        console.error('OpenWeather API key not found');
        return this.getMockWeatherData();
      }

      // Build location query
      const location = `${city},${state},${country}`;
      
      // Fetch weather data
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        console.error('Weather API error:', response.status);
        return this.getMockWeatherData();
      }

      const data = await response.json();

      // Transform OpenWeatherMap data to our format
      return {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        tempMin: Math.round(data.main.temp_min),
        tempMax: Math.round(data.main.temp_max),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        windDirection: data.wind.deg,
        visibility: Math.round(data.visibility / 1000), // Convert m to km
        clouds: data.clouds.all,
        conditions: data.weather[0].main,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
        sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
        city: data.name,
        country: data.sys.country,
        
        // Determine if it's flyable based on conditions
        flyable: this.isFlyable(
          data.wind.speed * 3.6,
          data.visibility / 1000,
          data.weather[0].main
        ),
        
        // Additional flight-relevant data
        flightConditions: this.getFlightConditions(
          data.wind.speed * 3.6,
          data.visibility / 1000,
          data.weather[0].main,
          data.clouds.all
        )
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return this.getMockWeatherData();
    }
  }

  static isFlyable(windSpeed, visibility, conditions) {
    // Basic flyability rules
    const maxWindSpeed = 35; // km/h
    const minVisibility = 3; // km
    const badConditions = ['Thunderstorm', 'Tornado', 'Squall'];

    return windSpeed <= maxWindSpeed && 
           visibility >= minVisibility && 
           !badConditions.includes(conditions);
  }

  static getFlightConditions(windSpeed, visibility, conditions, cloudCover) {
    // Determine flight condition rating
    if (!this.isFlyable(windSpeed, visibility, conditions)) {
      return {
        rating: 'poor',
        message: 'Not suitable for flight',
        color: 'red'
      };
    }

    if (windSpeed < 15 && visibility > 10 && cloudCover < 50) {
      return {
        rating: 'excellent',
        message: 'Perfect flying conditions',
        color: 'green'
      };
    }

    if (windSpeed < 25 && visibility > 5) {
      return {
        rating: 'good',
        message: 'Good flying conditions',
        color: 'blue'
      };
    }

    return {
      rating: 'fair',
      message: 'Acceptable flying conditions',
      color: 'yellow'
    };
  }

  static getMockWeatherData() {
    // Fallback mock data
    return {
      temp: 22,
      feelsLike: 24,
      tempMin: 18,
      tempMax: 26,
      humidity: 65,
      pressure: 1013,
      windSpeed: 12,
      windDirection: 180,
      visibility: 10,
      clouds: 25,
      conditions: 'Clear',
      description: 'clear sky',
      icon: '01d',
      sunrise: '06:30 AM',
      sunset: '06:45 PM',
      city: 'Unknown',
      country: 'XX',
      flyable: true,
      flightConditions: {
        rating: 'good',
        message: 'Good flying conditions',
        color: 'blue'
      }
    };
  }

  static getWeatherIcon(icon) {
    // Map OpenWeatherMap icons to emojis/icons
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[icon] || '🌤️';
  }

  static getWindDirectionText(degrees) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                       'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  }
}