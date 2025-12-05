import React from 'react';
import './Overlay.css';
import LeftPanel from '../LeftPanel/LeftPanel.jsx';
import SearchBar from '../SearchBar/SearchBar.jsx';
import RightPanel from '../RightPanel/RightPanel.jsx';

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const Overlay = ({ onSearch, searchedCity }) => {
  return (
    <div className="overlay-wrapper">
      <h2 className="app-title">Mausam</h2>
      <div className="overlay-card">
        <div className="left-section">
          <SearchBar onSearch={onSearch} apiKey={WEATHER_API_KEY} />
          <LeftPanel cityName={searchedCity} />
        </div>

        <div className="right-panel-container">
          <RightPanel cityName={searchedCity} />
        </div>
      </div>

    </div>
  );
};

export default Overlay;  