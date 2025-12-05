import React, { useState, useEffect } from "react";
import { Cloud, Droplets, Eye, Droplet, MapPin, Loader } from "lucide-react";
import "./LeftPanel.css";
import { getWeatherDescription } from "../../utils/WeatherDescriptions.js";

export default function LeftPanel({ cityName }) {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  // Fetch weather by coordinates
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) throw new Error("Weather fetch failed");

      const data = await response.json();
      setWeatherData(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather by city name
  const fetchWeatherByCity = async (city) => {
    try {
      setLoading(true);
      
      // First get coordinates
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoResponse.json();

      if (!geoData.length) throw new Error("City not found");

      // Then get weather
      await fetchWeatherByCoords(geoData[0].lat, geoData[0].lon);
    } catch (err) {
      console.error(err);
      setError("City not found or unable to fetch weather");
      setLoading(false);
    }
  };

  // Get geolocation on mount (only if no city is being searched)
  useEffect(() => {
    if (!API_KEY) {
      setError("Missing API key");
      setLoading(false);
      return;
    }

    // Only fetch geolocation if no cityName has been provided
    if (!cityName && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Location access denied. Using default values.");
          setLoading(false);
        }
      );
    } else if (!cityName) {
      setError("Geolocation not supported");
      setLoading(false);
    }
  }, []);
  // Update when city is searched
  useEffect(() => {
    if (cityName) {
      fetchWeatherByCity(cityName);
    }
  }, [cityName]);

  // Extract weather condition for description
  const weatherCondition = weatherData?.weather?.[0]?.main?.toLowerCase() || "default";
  const weatherDescription = getWeatherDescription(weatherCondition);

  // Format location
  const getLocation = () => {
    if (loading) return "Fetching your location...";
    if (!weatherData) return "Your City, Your State, Your Country";
    
    const city = weatherData.name || "Unknown City";
    const country = weatherData.sys?.country || "";
    return `${city}${country ? `, ${country}` : ""}`;
  };

  // Get weather title
  const getWeatherTitle = () => {
    if (loading) return "Loading...";
    if (!weatherData) return "Weather";
    return weatherData.weather?.[0]?.main || "Weather";
  };

  return (
    <div className="left-panel-container">
      {/* Top section */}
      <div className="left-panel-top">
        <div className="location">
          <MapPin size={16} className="location-icon" />
          {getLocation()}
        </div>
        
        <div className="temperature">
          {loading ? (
            <Loader size={32} className="animate-spin" />
          ) : weatherData ? (
            `${Math.round(weatherData.main?.temp || 0)}°`
          ) : (
            "--°"
          )}
        </div>
        
        <div className="weather-title">{getWeatherTitle()}</div>
        
        <div className="weather-description">
          {weatherDescription}
        </div>
      </div>

      {/* Weather Cards Grid */}
      <div className="left-panel-grid">
        {/* Feels Like */}
        <div className="weather-card">
          <div className="card-header">
            <Cloud size={16} className="card-icon" />
            <span className="card-title">Feels Like</span>
          </div>
          <div className="card-value">
            {loading ? "--" : weatherData ? `${Math.round(weatherData.main?.feels_like || 0)}°` : "--°"}
          </div>
          <div className="card-subtext">
            {weatherData && weatherData.main?.feels_like > weatherData.main?.temp
              ? "Humidity is making it feel warmer"
              : "Feels cooler due to wind"}
          </div>
        </div>

        {/* Precipitation - Note: OpenWeather free tier doesn't include this, showing rain volume if available */}
        <div className="weather-card">
          <div className="card-header">
            <Droplets size={16} className="card-icon" />
            <span className="card-title">Precipitation</span>
          </div>
          <div className="card-value">
            {loading ? "--" : weatherData?.rain?.["1h"] 
              ? `${weatherData.rain["1h"]} mm`
              : weatherData?.rain?.["3h"]
              ? `${weatherData.rain["3h"]} mm`
              : "0 mm"}
          </div>
          <div className="card-subtext">
            {weatherData?.rain ? "in last hour" : "No rain detected"}
          </div>
        </div>

        {/* Visibility */}
        <div className="weather-card">
          <div className="card-header">
            <Eye size={16} className="card-icon" />
            <span className="card-title">Visibility</span>
          </div>
          <div className="card-value">
            {loading ? "--" : weatherData 
              ? `${(weatherData.visibility / 1000).toFixed(1)} km`
              : "-- km"}
          </div>
        </div>

        {/* Humidity */}
        <div className="weather-card">
          <div className="card-header">
            <Droplet size={16} className="card-icon" />
            <span className="card-title">Humidity</span>
          </div>
          <div className="card-value">
            {loading ? "--" : weatherData ? `${weatherData.main?.humidity || 0}%` : "--%"}
          </div>
          <div className="card-footer">
            {weatherData && `The dew point is ${Math.round(
              weatherData.main?.temp - ((100 - weatherData.main?.humidity) / 5)
            )}° right now`}
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          background: 'rgba(255, 0, 0, 0.1)',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#ff6b6b'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}