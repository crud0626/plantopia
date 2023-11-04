import axios, { AxiosResponse } from 'axios';
import { WeatherResponse } from '@/@types/weather.type';
import { Coordinates } from '@/utils/geolocation';

const fetchWeatherInfo = ({
  latitude,
  longitude,
}: Coordinates): Promise<AxiosResponse<WeatherResponse>> => {
  const instance = axios.create({
    baseURL: 'https://api.openweathermap.org/data/2.5',
    params: {
      units: 'metric',
      appid: process.env.NEXT_PUBLIC_WEATHER_API_KEY,
      lat: latitude,
      lon: longitude,
    },
  });

  return instance.get('weather');
};

export { fetchWeatherInfo };
