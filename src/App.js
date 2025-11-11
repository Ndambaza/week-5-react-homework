import React, { useEffect, useState } from "react";
import axios from "axios";
import WeatherData from "./Weather";
import Header from "./header";
import Footer from "./footer";
import "./App.css";
import "./index.css";

function App() {
  const [theme, setTheme] = useState("day-theme");
  const [weather, setWeather] = useState({
    city: "London",
    temperature: 12,
    description: "Cloudy",
    timezone: 0,
    humidity: 60,
    wind: 0,
  });

  // Put theme on body
  useEffect(() => {
    document.body.classList.remove("day-theme", "night-theme");
    document.body.classList.add(theme);
  }, [theme]);

  // Update theme based on city local time
  useEffect(() => {
    if (typeof weather.timezone !== "number") return;

    const updateThemeBasedOnTime = () => {
      const utcHour = new Date().getUTCHours();
      const cityHour = (utcHour + weather.timezone / 3600 + 24) % 24;
      setTheme(cityHour >= 18 || cityHour < 6 ? "night-theme" : "day-theme");
    };

    updateThemeBasedOnTime();
    const id = setInterval(updateThemeBasedOnTime, 60_000);
    return () => clearInterval(id);
  }, [weather.timezone]);

  // Initial fetch
  useEffect(() => {
    handleSearch("London");
  }, []);

  function handleSearch(newCity) {
    const apiKey = "24d6cb2a7c0d27fcc186996bccf9c722";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      newCity
    )}&appid=${apiKey}&units=metric`;

    axios
      .get(url)
      .then((response) => {
        const d = response.data;
        setWeather({
          city: d.name,
          temperature: d.main?.temp ?? 0,
          description: d.weather?.[0]?.description ?? "",
          timezone: d.timezone ?? 0,
          humidity: d.main?.humidity ?? 0,
          wind: d.wind?.speed ?? 0,
        });
      })
      .catch((error) => {
        console.error(error);
        alert(`Could not fetch weather for "${newCity}".`);
      });
  }

  return (
    <div className={theme}>
      <Header onSearch={handleSearch} />
      <WeatherData
        city={weather.city}
        temperature={weather.temperature}
        description={weather.description}
        timezone={weather.timezone}
        humidity={weather.humidity}
        wind={weather.wind}
        theme={theme}
      />{" "}
      <Footer />
    </div>
  );
}

export default App;
