import { useState } from "react";
import "./App.css";
import BackDrop from "./components/BackDrop/BackDrop.jsx";
import Overlay from "./components/Overlay/Overlay.jsx";
import Footer from "./components/Footer/Footer.jsx";

function App() {
  const [searchedCity, setSearchedCity] = useState("");

   const handleSearch = (cityName) => {
    console.log("Searching for city:", cityName); // Debug log
    setSearchedCity(cityName);
  };


  return (
    <div className="app-container">
      <BackDrop cityName={searchedCity} />

      <div className="foreground">
        <Overlay onSearch={handleSearch} searchedCity={searchedCity} />
        <Footer />
      </div>
    </div>
  );
}

export default App;