# 🌤️ **Mausam — Weather Forecasting App**

Live Demo: https://mausam-4b8j.onrender.com

**Mausam** is a beautifully designed, responsive weather forecasting web application that brings meteorology and ambience together.
It fetches real-time weather data using the **OpenWeather API** and transforms the entire screen into an immersive, cinematic backdrop that changes dynamically based on **weather**, **time of day**, and **user location**.

---

## **Features**

### **Dynamic City Search with Suggestions**

- Smart search bar with instant city suggestions.
- Fetches data as the user types.
- Gracefully handles incorrect or partial searches.

### **Automatic Location Detection**

- Uses browser geolocation (with permission) to automatically detect and display the user's local weather.

### **Cinematic Weather Backdrops**

- Background video/visual changes depending on:

  - Weather condition (clear, rain, haze, snow, storm, etc.)
  - Time of day (day & night)

### **Fully Responsive Layout**

- Smooth layout transitions for all sizes.

### **Comprehensive Weather Details**

For the selected city, Mausam shows:

- Temperature + Feels Like
- UV Index
- Wind Speed
- Cloud Cover
- Humidity
- Visibility
- Precipitation Probability
- Air Quality

### **Hourly Forecast**

- Next several hours displayed with icons, temperature, and time.

### **7-Day Weekly Forecast**

- Min/max temperatures
- Weather icon
- Date formatting
- Fully stabilized using unique-day filtering

### **Poetic Weather Description**

- A small creative touch.
- Mausam generates a poetic line or atmospheric description inspired by the current weather.

---

## **How It Works**

### **1. Weather Data Fetching**

Mausam uses:

- `OpenWeather Current Weather API`
- `OpenWeather Air Pollution API`
- `OpenWeather 5 Day / 3 Hour Forecast API`

### **2. Automatic Time-Based Ambience**

The app detects:

- Local time of the searched city
- Adjusts backdrops accordingly (sunset glow, night sky, etc.)

### **3. City Suggestion Engine**

- On every keystroke, Mausam hits `OpenWeather Geo API` to fetch matching cities.
- Uses debouncing for smoothness.

### **4. Responsive Architecture**

- **Left Panel:** major info + search
- **Right Panel:** forecasts + detailed stats
- **Adaptive:** stacks vertically on smaller screens

---

## **Tech Stack**

- **React.js** (Vite)
- **CSS (custom styles + animations)**
- **OpenWeather API**
- **Geolocation API**
- **JavaScript utility functions for date, API structuring, and forecast shaping**

---

## **Installation & Setup**

```bash
git clone https://github.com/YourUsername/mausam.git
cd mausam
npm install
```

Create a `.env` file:

```
VITE_WEATHER_API_KEY=your_openweather_api_key
```

Then:

```bash
npm run dev
```

---

## **Folder Structure (Simplified)**

```
src/
  components/
    Backdrop/
    Overlay/
    LeftPanel/
    RightPanel/
    SearchBar/
  utils/
    WeatherVideos.js
    WeatherDescriptions.js
```

---

## **End Note**

Mausam aims to blend **data** with **emotion**.
Weather should _feel_ alive, so every corner of the UI responds to shifts in mood, light, and sky.

---
