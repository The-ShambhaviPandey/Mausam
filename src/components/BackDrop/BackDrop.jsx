import { useState, useEffect } from 'react';
import './BackDrop.css';
import { getWeatherMedia } from '../../utils/WeatherVideos.js';

const WeatherBackdrop = ({ coords, cityName }) => {
  const [weatherKey, setWeatherKey] = useState('default');
  const [timeOfDay, setTimeOfDay] = useState('day');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const mapConditionToKey = (main, id, description) => {
    if (!main) return null;

    const m = main.toLowerCase();
    const desc = (description || '').toLowerCase();

    if (m.includes('cloud')) return 'clouds';
    if (m.includes('drizzle')) return 'drizzle';
    if (m.includes('rain')) return 'rain';
    if (m.includes('snow')) return 'snow';
    if (m.includes('thunder')) return 'thunderstorm';
    if (m.includes('mist') || m.includes('fog') || m.includes('smoke')) return 'fog';
    if (m.includes('haze') || m.includes('sand') || m.includes('dust')) return 'haze';
    if (m.includes('clear')) return 'clear';

    if (desc.includes('rain')) return 'rain';

    return 'default';
  };

  const getTimeOfDay = (sunrise, sunset, timezoneOffsetSeconds) => {
    const utc = Date.now(); 
    const local = utc + timezoneOffsetSeconds * 1000;

    const now = local / 1000;

    return now >= sunrise && now <= sunset ? 'day' : 'night';
  };

  const fetchWeather = async (lat, lon) => {
    try {
      setIsLoading(true);

      const resp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      if (!resp.ok) throw new Error("Weather API failed.");

      const data = await resp.json();
      const w = data.weather?.[0];
      const key = mapConditionToKey(w?.main, w?.id, w?.description);

      // calculate day/night using sunrise, sunset and timezone
      const tod = getTimeOfDay(data.sys.sunrise, data.sys.sunset, data.timezone);

      setWeatherKey(key || 'default');
      setTimeOfDay(tod);
      setError("");

    } catch (err) {
      console.log(err);
      setError("Couldn't load weather. Using default backdrop.");
      setWeatherKey("default");
      setTimeOfDay("day");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!API_KEY) {
      setError("Missing API key.");
      setIsLoading(false);
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          fetchWeather(latitude, longitude);
        },
        err => {
          console.log("Geolocation error:", err);
          setError("Couldn't access your location.");
          setIsLoading(false);
        }
      );
    }
  }, []);

  // search override
  useEffect(() => {
    if (!cityName) return;

    const getCityCoords = async () => {
      try {
        const r = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`
        );
        const d = await r.json();

        if (!d.length) throw new Error("City not found.");

        fetchWeather(d[0].lat, d[0].lon);
      } catch (err) {
        console.log(err);
        setError("City not found or couldn't fetch weather.");
        setWeatherKey('default');
        setTimeOfDay('day');
        setIsLoading(false);
      }
    };

    getCityCoords();
  }, [cityName]);

  const currentMedia = getWeatherMedia(weatherKey, timeOfDay);

  const handleVideoError = () => {
    console.log("Video failed to load");
    setWeatherKey('default');
    setTimeOfDay('day');
  };

  return (
    <div className="backdrop-container">
      <video
        className={`backdrop-media ${isLoading ? 'loading' : 'loaded'}`}
        autoPlay
        loop
        muted
        playsInline
        key={`${weatherKey}-${timeOfDay}`}
        onLoadedData={() => setIsLoading(false)}
        onError={handleVideoError}
      >
        <source src={currentMedia.src} type="video/mp4" />
      </video>

      {error && (
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          zIndex: 20,
          fontSize: 12,
          color: 'white',
          padding: '6px 10px',
          background: 'rgba(0,0,0,0.4)',
          borderRadius: 6,
          backdropFilter: 'blur(4px)'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default WeatherBackdrop;
