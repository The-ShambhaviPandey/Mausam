import React, { useState, useEffect } from "react";
import { Sun, Wind, Cloud, Gauge, Clock, Calendar, Loader } from "lucide-react";
import "./RightPanel.css";

export default function RightPanel({ cityName }) {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Fetch all weather data
  const fetchWeatherData = async (lat, lon) => {
    try {
      setLoading(true);

      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const currentData = await currentResponse.json();
      setCurrentWeather(currentData);

      // Fetch 5-day forecast (includes hourly data)
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const forecast = await forecastResponse.json();
      setForecastData(forecast);

      // Fetch air quality
      const airResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );
      const airData = await airResponse.json();
      setAirQuality(airData);

    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch by city name
  const fetchByCity = async (city) => {
    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();
      
      if (geoData.length > 0) {
        await fetchWeatherData(geoData[0].lat, geoData[0].lon);
      }
    } catch (error) {
      console.error("Error fetching city data:", error);
    }
  };

  // Get geolocation on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  // Update when city searched
  useEffect(() => {
    if (cityName) {
      fetchByCity(cityName);
    }
  }, [cityName]);

  // Get weather emoji based on condition
  const getWeatherEmoji = (weatherMain, weatherId) => {
    const main = weatherMain?.toLowerCase();
    
    if (main === 'clear') return '☀️';
    if (main === 'clouds') return weatherId === 801 || weatherId === 802 ? '⛅' : '☁️';
    if (main === 'rain') return '🌧️';
    if (main === 'drizzle') return '🌦️';
    if (main === 'thunderstorm') return '⛈️';
    if (main === 'snow') return '❄️';
    if (main === 'mist' || main === 'fog') return '🌫️';
    return '🌤️';
  };

  // Process hourly forecast (next 7 hours from 3-hour intervals)
  const getHourlyForecast = () => {
    if (!forecastData?.list) return [];
    
    const now = new Date();
    const hourly = [];
    
    // Add "Now" from current weather
    if (currentWeather) {
      hourly.push({
        time: "Now",
        temp: `${Math.round(currentWeather.main.temp)}°`,
        icon: getWeatherEmoji(currentWeather.weather[0].main, currentWeather.weather[0].id),
        isNow: true
      });
    }

    // Add next 6 forecast items
    forecastData.list.slice(0, 6).forEach(item => {
      const date = new Date(item.dt * 1000);
      const hours = date.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      
      hourly.push({
        time: `${displayHours} ${ampm}`,
        temp: `${Math.round(item.main.temp)}°`,
        icon: getWeatherEmoji(item.weather[0].main, item.weather[0].id),
        isNow: false
      });
    });

    return hourly;
  };

  const getWeeklyForecast = () => {
    if (!forecastData?.list) return [];

    const daily = {};
    const now = new Date();
    const todayStr = now.toDateString();

    // Add TODAY from current weather
    if (currentWeather) {
      daily[todayStr] = {
        temps: [currentWeather.main.temp],
        weather: currentWeather.weather[0],
        date: now
      };
    }

    // Add forecast data - group by date
    forecastData.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toDateString();

      if (!daily[dateStr]) {
        daily[dateStr] = {
          temps: [],
          weather: item.weather[0],
          date
        };
      }
      daily[dateStr].temps.push(item.main.temp);
    });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Sort by date and take only the days we have data for (no placeholders)
    const entries = Object.entries(daily)
      .sort(([, a], [, b]) => a.date - b.date)
      .slice(0, 7); // Take maximum 7 days but don't add fake ones

    return entries.map(([dateStr, data]) => {
      const isToday = dateStr === todayStr;
      const high = Math.round(Math.max(...data.temps));
      const low = Math.round(Math.min(...data.temps));

      return {
        day: isToday ? "Today" : weekDays[data.date.getDay()],
        high: `${high}°`,
        low: `${low}°`,
        icon: getWeatherEmoji(data.weather.main, data.weather.id),
        isToday
      };
    });
  };
  
  // Calculate UV Index (simplified - OpenWeather doesn't provide this in free tier)
  const getUVIndex = () => {
    if (!currentWeather) return 0;
    // Simplified calculation based on cloud cover and time
    const clouds = currentWeather.clouds?.all || 0;
    const baseUV = 5;
    return Math.max(0, Math.round(baseUV * (1 - clouds / 200)));
  };

  // Get UV text
  const getUVText = (uv) => {
    if (uv <= 2) return "Low — no protection needed";
    if (uv <= 5) return "Moderate — use protection";
    if (uv <= 7) return "High — protection required";
    if (uv <= 10) return "Very high — extra protection";
    return "Extreme — avoid sun exposure";
  };

  // Get AQI status
  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { text: "Good", class: "good" };
    if (aqi <= 100) return { text: "Moderate", class: "moderate" };
    if (aqi <= 150) return { text: "Unhealthy for Sensitive", class: "unhealthy-sensitive" };
    if (aqi <= 200) return { text: "Unhealthy", class: "unhealthy" };
    if (aqi <= 300) return { text: "Very Unhealthy", class: "very-unhealthy" };
    return { text: "Hazardous", class: "hazardous" };
  };

  // Convert OpenWeather AQI (1-5) to US AQI (0-500)
  const convertToUSAQI = (owAqi) => {
    const mapping = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 250 };
    return mapping[owAqi] || 50;
  };

  // Get cloud cover text
  const getCloudText = (clouds) => {
    if (clouds <= 10) return "Clear";
    if (clouds <= 25) return "Few Clouds";
    if (clouds <= 50) return "Partly Cloudy";
    if (clouds <= 75) return "Mostly Cloudy";
    return "Overcast";
  };

  const uvValue = getUVIndex();
  const hourlyData = getHourlyForecast();
  const weeklyData = getWeeklyForecast();
  const windSpeed = currentWeather?.wind?.speed ? Math.round(currentWeather.wind.speed * 2.237) : 0; // m/s to mph
  const windDeg = currentWeather?.wind?.deg || 0;
  const cloudCover = currentWeather?.clouds?.all || 0;
  const aqiValue = airQuality?.list?.[0]?.main?.aqi ? convertToUSAQI(airQuality.list[0].main.aqi) : 50;
  const aqiStatus = getAQIStatus(aqiValue);

  if (loading) {
    return (
      <div className="right-panel-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader size={32} className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="right-panel-container">
      {/* Hourly Forecast */}
      <div className="forecast-section">
        <h3 className="section-title">
          <Clock size={18} className="title-icon" />
          Hourly Forecast
        </h3>
        <div className="hourly-scroll">
          {hourlyData.length > 0 ? hourlyData.map((hour, index) => (
            <div key={index} className={`hourly-item ${hour.isNow ? 'highlight' : ''}`}>
              <div className="hourly-time">{hour.time}</div>
              <div className="hourly-icon">{hour.icon}</div>
              <div className="hourly-temp">{hour.temp}</div>
            </div>
          )) : (
            <div style={{ padding: '20px', textAlign: 'center', opacity: 0.6 }}>
              No forecast data available
            </div>
          )}
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="forecast-section">
        <h3 className="section-title">
          <Calendar size={18} className="title-icon" />
          7-Day Forecast
        </h3>
        <div className="weekly-scroll">
          {weeklyData.length > 0 ? weeklyData.map((day, index) => (
            <div key={index} className={`weekly-item ${day.isToday ? 'highlight' : ''}`}>
              <div className="weekly-day">{day.day}</div>
              <div className="weekly-icon">{day.icon}</div>
              <div className="weekly-temps">
                <span className="temp-high">{day.high}</span>
                <span className="temp-low">{day.low}</span>
              </div>
            </div>
          )) : (
            <div style={{ padding: '20px', textAlign: 'center', opacity: 0.6 }}>
              No forecast data available
            </div>
          )}
        </div>
      </div>

      {/* Weather Detail Cards */}
      <div className="detail-cards-grid">

        {/* UV Index */}
        <div className="uv-card detail-card">
          <div className="detail-header">
            <Sun size={16} className="detail-icon" />
            <span className="detail-title">UV Index</span>
          </div>

          <div className="uv-column">
            <div className="uv-arc-container" aria-hidden="true">
              <div className="uv-arc">
                <div
                  className="uv-indicator"
                  style={{ transform: `rotate(${(-90 + (uvValue / 11) * 180)}deg)` }}
                />
              </div>
            </div>

            <div className="uv-info-center">
              <div className="uv-value-number">{uvValue}</div>
              <div className="uv-text">{getUVText(uvValue)}</div>
            </div>
          </div>
        </div>

        {/* Air Quality */}
        <div className="detail-card air-card">
          <div className="detail-header">
            <Gauge size={16} className="detail-icon" />
            <span className="detail-title">Air Quality</span>
          </div>

          <div className="aqi-value-row">
            <div className="aqi-number">{aqiValue}</div>
            <div className="aqi-status">{aqiStatus.text}</div>
          </div>

          <div className="aqi-bar-wrapper">
            <div className="aqi-bar">
              <div
                className={`aqi-bar-indicator ${aqiStatus.class}`}
                style={{ left: `${(aqiValue / 500) * 100}%` }}
              ></div>
            </div>
            <div className="aqi-scale-labels">
              <span>0</span>
              <span>500</span>
            </div>
          </div>

          <div className="detail-footer">
            {aqiValue <= 50 ? "Air quality is satisfactory" : "Consider reducing outdoor activities"}
          </div>
        </div>

        {/* Wind Card */}
        <div className="detail-card wind-card">
          <div className="detail-header">
            <Wind size={16} className="detail-icon" />
            <span className="detail-title">Wind</span>
          </div>

          <div className="wind-compass-wrapper">
            <div className="wind-compass">
              <div
                className="wind-needle"
                style={{ transform: `rotate(${windDeg}deg)` }}
              />

              <span className="dir-n">N</span>
              <span className="dir-ne">NE</span>
              <span className="dir-e">E</span>
              <span className="dir-se">SE</span>
              <span className="dir-s">S</span>
              <span className="dir-sw">SW</span>
              <span className="dir-w">W</span>
              <span className="dir-nw">NW</span>
            </div>

            <div className="wind-speed">{windSpeed} mph</div>
          </div>
        </div>

        {/* Cloud Cover */}
        <div className="detail-card cloud-card">
          <div className="detail-header">
            <Cloud size={16} className="detail-icon" />
            <span className="detail-title">Cloud Cover</span>
          </div>

          <div className="cloud-meter-wrapper">
            <div className="cloud-meter">
              <div
                className="cloud-arc-indicator"
                style={{ transform: `rotate(${(cloudCover / 100) * 180 - 90}deg)` }}
              />
            </div>
            <div className="cloud-info">
              <div className="cloud-value">{cloudCover}%</div>
              <div className="cloud-text">{getCloudText(cloudCover)}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}