import axios from 'axios';

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';

export const getWeatherData = async (location: string) => {

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        location
      )}&units=metric&appid=${WEATHER_API_KEY}`
    );
    
    const data = response.data;
    return {
      location: data.name,
      temperature: data.main.temp,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return {
      location,
      temperature: null,
      description: 'Unable to fetch weather data',
      error: 'Weather service unavailable'
    };
  }
};