import React, { useEffect, useState } from 'react';
import { logout } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import '../css/WeatherPage.css';

const WeatherPage = () => {
  const [city, setCity] = useState(localStorage.getItem('city') || 'Moscow');
  const [inputCity, setInputCity] = useState(city);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_KEY = process.env.REACT_APP_OPENWEATHER_KEY;

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=ru`
      );
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Город не найден');
        }
        throw new Error('Ошибка при загрузке данных');
      }
      const data = await res.json();
      setWeather(data);
      setCity(cityName);
      localStorage.setItem('city', cityName);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCity.trim() === '') return;
    fetchWeather(inputCity.trim());
  };

  return (
    <div className="weather-container">
      <h2 className="weather-title">Погода в {city}</h2>

      <form onSubmit={handleSubmit} className="city-form">
        <input
          type="text"
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          placeholder="Введите город"
          className="city-input"
        />
        <button type="submit" className="city-submit-button">Показать</button>
      </form>

      {loading && <p className="weather-loading">Загрузка погоды...</p>}
      {error && <p className="weather-error">{error}</p>}

      {weather && (
        <div className="weather-info">
          <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
          <div className="weather-details">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
              alt={weather.weather[0].description}
              className="weather-icon"
            />
            <div className="weather-desc">{weather.weather[0].description}</div>
          </div>
          <div className="weather-wind">Ветер: {weather.wind.speed} м/с</div>
        </div>
      )}

      <button className="logout-button" onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default WeatherPage;
