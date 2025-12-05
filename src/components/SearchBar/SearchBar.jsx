import { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./SearchBar.css";

function SearchBar({ onSearch, apiKey }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchCitySuggestions = async (value) => {
    if (!value) return setSuggestions([]);
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${value}&limit=5&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.cod && data.message) {
        console.error("API Error:", data.message);
        setSuggestions([]);
      } else if (Array.isArray(data)) {
        const cityList = data.map((item) => ({
          id: `${item.name}-${item.lat}-${item.lon}`,
          name: item.name, // Store just the city name
          label: `${item.name}, ${item.country}`,
          ...item,
        }));
        setSuggestions(cityList);
      } else {
        console.warn("Unexpected API response:", data);
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setSuggestions([]);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchCitySuggestions(value);
  };

  const handleSelect = (city) => {
    setQuery(city.label); // Display the full label in the input
    setSuggestions([]);
    onSearch(city.name); // But send just the city name to the parent
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    // Extract just the city name if it's in "City, Country" format
    const cityName = query.split(',')[0].trim();
    onSearch(cityName);
    setSuggestions([]);
  };

  return (
    <div className="searchbar-container" ref={searchContainerRef}>
      <form onSubmit={handleSubmit} className="searchbar-form">
        <div className="search-icon">
          <FaSearch />
        </div>
        <input
          type="text"
          placeholder="Search city..."
          value={query}
          onChange={handleInputChange}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((city) => (
            <li
              key={city.id}
              className="suggestion-item"
              onClick={() => handleSelect(city)}
            >
              {city.label}
            </li>
          ))}
        </ul>
      )}
      {loading && <div className="loading-text">Loading...</div>}
    </div>
  );
}

export default SearchBar;