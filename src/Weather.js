import React, { useState } from "react";
import ReactAnimatedWeather from "react-animated-weather";

export default function WeatherData(props) {
  const [unit, setUnit] = useState("celsius");

  function getWeatherIcon(description) {
    const desc = (description || "").toLowerCase();
    const isNight = props.theme === "night-theme";

    if (desc.includes("snow")) return "SNOW";
    if (desc.includes("sleet")) return "SLEET";
    if (desc.includes("rain") || desc.includes("drizzle")) return "RAIN";
    if (desc.includes("fog") || desc.includes("mist") || desc.includes("haze"))
      return "FOG";
    if (desc.includes("wind")) return "WIND";
    if (desc.includes("cloud")) {
      if (desc.includes("part"))
        return isNight ? "PARTLY_CLOUDY_NIGHT" : "PARTLY_CLOUDY_DAY";
      return "CLOUDY";
    }
    if (desc.includes("clear") || desc.includes("sunny"))
      return isNight ? "CLEAR_NIGHT" : "CLEAR_DAY";
    return "CLOUDY";
  }

  const iconType = getWeatherIcon(props.description);
  const iconColor = props.theme === "night-theme" ? "white" : "orange";

  const getTemperature = (celsius) => {
    const c = typeof celsius === "number" ? celsius : 0;
    if (unit === "fahrenheit") return Math.round((c * 9) / 5 + 32);
    return Math.round(c);
  };

  const formatWind = (speedMs) => {
    if (typeof speedMs !== "number") return "-";
    return `${Math.round(speedMs * 3.6)} km/h`;
  };

  const getLocalDateTime = () => {
    const tz = typeof props.timezone === "number" ? props.timezone : 0;
    const nowUtcMs = Date.now() + new Date().getTimezoneOffset() * 60000;
    const local = new Date(nowUtcMs + tz * 1000);
    const time = local.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const date = local.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    return { time, date };
  };

  const { time, date } = getLocalDateTime();

  return (
    <div className="weather-app">
      <main>
        <div className="weather-app-data">
          <div>
            <h1 className="weather-app-city">{props.city}</h1>
            <p className="weather-app-details">
              <span className="time">
                {date} <br /> {time}
              </span>
              , <span className="description">{props.description}</span>
              <br />
              Humidity: <strong className="humidity">{props.humidity}%</strong>,
              Wind:{" "}
              <strong className="wind-speed">{formatWind(props.wind)}</strong>
            </p>
          </div>

          <div className="weather-app-temperature-container">
            <div className="icon">
              <ReactAnimatedWeather
                icon={iconType}
                color={iconColor}
                size={64}
                animate={true}
              />
            </div>
            <div className="weather-app-temperature">
              <span className="temperature-value">
                {getTemperature(props.temperature)}
              </span>
              <span className="weather-app-unit">
                <button
                  type="button"
                  className={`celsius-temp ${
                    unit === "celsius" ? "active" : ""
                  }`}
                  onClick={() => setUnit("celsius")}
                >
                  °C
                </button>{" "}
                |{" "}
                <button
                  type="button"
                  className={`fahrenheit-temp ${
                    unit === "fahrenheit" ? "active" : ""
                  }`}
                  onClick={() => setUnit("fahrenheit")}
                >
                  °F
                </button>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
