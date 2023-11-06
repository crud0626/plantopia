'use client';

import { useState, useEffect, useCallback } from 'react';
import { WeatherResponse } from '@/@types/weather.type';
import { fetchWeatherInfo } from '@/api/weatherApi';
import { weatherContents } from '@/constants/weather';
import { getGeolocation } from '@/utils/geolocation';

import styles from './page.module.scss';
import LOCATION from '@/assets/icons/location.png';

const WeatherSection = () => {
  const [weatherInfo, setWeatherInfo] = useState<WeatherResponse | null>(null);
  const [visibleText, setVisibleText] =
    useState('날씨 정보를 불러오는 중입니다.');

  const formatTemperature = useCallback(
    (temp: number) => `${Math.floor(temp)}°`,
    [],
  );

  const getWeatherContent = useCallback((code?: number) => {
    if (!code) return;

    const commonCode = code - (code % 100);
    return weatherContents[code] || weatherContents[commonCode];
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const coords = await getGeolocation();
        const { data: weatherData } = await fetchWeatherInfo(coords);
        setWeatherInfo(weatherData);
      } catch {
        setVisibleText('날씨 정보를 불러올 수 없습니다.');
      }
    })();
  }, []);

  const content = getWeatherContent(weatherInfo?.weather[0].id);

  return (
    <div className={styles.weather_wrapper}>
      {weatherInfo && content ? (
        <>
          <div className={styles.text_wrapper}>
            <div className={styles.location_wrapper}>
              <img
                src={LOCATION}
                className={styles.weather_icon}
                alt="location"
              />
              <span className={styles.text}>{weatherInfo.name}</span>
            </div>
            <div
              className={`${styles.weather_text_box} ${styles.temperature_wrapper}`}
            >
              <span className={styles.text_lg}>
                {content.title} {formatTemperature(weatherInfo.main.temp)}
              </span>
              <span className={styles.text_sm}>
                {formatTemperature(weatherInfo.main.temp_max)}
              </span>
              <span className={styles.text_sm}>
                {formatTemperature(weatherInfo.main.temp_min)}
              </span>
            </div>
            <div className={styles.weather_text_box}>{content.description}</div>
          </div>
          <img
            src={content.imgSrc}
            className={styles.weather_icon}
            alt="weather"
          />
        </>
      ) : (
        <p className={styles.info_text}>{visibleText}</p>
      )}
    </div>
  );
};

export default WeatherSection;
