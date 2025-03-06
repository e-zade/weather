import React, { useState, useEffect, useRef } from "react";
import { Button, TextField } from "@mui/material";
import style from "./index.module.scss";
import backgroundMusic from "/src/assets/music/background.mp3";

const api = {
  key: "91030e46de594fe89d367b7b9afcae1c",
  base: "https://api.openweathermap.org/data/2.5/",
};
const Hava = () => {
  const [search, setSearch] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const audioRef = useRef(null);

  const playMusic = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.log("Musiqi başlamadı:", error);
      });
    }
  };

  const searchReset = async () => {
    if (!search.trim()) {
      setError("Please enter a city name.");
      setWeatherData(null);
      return;
    }

    setLoading(true);
    playMusic();
    try {
      const response = await fetch(
        `${api.base}weather?q=${search}&units=metric&APPID=${api.key}`
      );
      const result = await response.json();

      if (result.cod === "404") {
        setError("City not found. Please check the name and try again.");
        setWeatherData(null);
      } else {
        setWeatherData(result);
        setError(null);
      }
    } catch (error) {
      setError("An error occurred while fetching weather data.");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const getBackground = (temp) => {
    if (temp === undefined || temp === null)
      return "url('https://cdn.pixabay.com/animation/2023/09/07/17/09/17-09-50-395_512.gif')";
    if (temp < 10)
      return "url('https://media.tenor.com/I1A5y1eVv5UAAAAM/cold.gif')";
    if (temp >= 10 && temp < 25)
      return "url('https://cdn.pixabay.com/animation/2023/02/27/11/27/11-27-59-421_512.gif')";
    return "url('https://example.com/hot-weather.gif')";
  };

  return (
    <div
      className={style.container}
      style={{
        backgroundImage: getBackground(weatherData?.main?.temp),
        backgroundSize: "cover",
      }}
    >
      <audio ref={audioRef} loop>
        <source src={backgroundMusic} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className={style.searchContainer}>
        <TextField
          label="Enter your city"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          type="button"
          onClick={searchReset}
          variant="contained"
          color="primary"
        >
          Search
        </Button>
      </div>

      {loading && <p className={style.loading}>Loading...</p>}
      {error && <p className={style.errorMessage}>{error}</p>}
      {weatherData && (
        <div className={style.weatherInfo}>
          <h2>{weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Weather: {weatherData.weather[0].main}</p>
          <p>Description: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
};

export default Hava;
