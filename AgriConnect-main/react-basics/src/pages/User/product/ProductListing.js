import React, { useState } from 'react';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = 'c4b469446da64a62a7455412241903'; // Your Weather API key

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a valid city name.');
      return;
    }

    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=yes`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={containerStyle}>
      <div className="titleCard" style={titleCardStyle}>
        <p className="title" style={titleStyle}>
          <span style={{ color: '#0A6847' }}>Weather</span> APP
        </p>
        <p className="desc" style={descStyle}>
          Get the weather details of any city, Right Now!
        </p>
      </div>

      <div className="card" style={cardStyle}>
        <input
          id="cityInput"
          className="inputBox"
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter your city"
          style={inputStyle}
        />
        <button
          id="searchBtn"
          className="btnSearch"
          onClick={fetchWeather}
          disabled={loading}
          style={buttonStyle(loading)}
        >
          {loading ? 'Loading...' : 'Search'}
        </button>
      </div>

      {error && (
        <div style={errorStyle}>
          <p>{error}</p>
        </div>
      )}

      {weatherData && (
        <div id="outputCard" className="output" style={outputStyle}>
          <div className="cityNameCard">
            <p id="city-name" style={cityNameStyle}>
              {weatherData.location.name}, {weatherData.location.region}
            </p>
            <p id="countryName" style={countryNameStyle}>
              {weatherData.location.country}
            </p>
          </div>
          <div className="tempCard" style={tempCardStyle}>
            <p id="temp" style={tempStyle}>
              {weatherData.current.temp_c}
            </p>
            <sup id="sup" style={supStyle}>
              °C
            </sup>
          </div>
          <p id="loc-time" style={timeStyle}>
            {weatherData.location.localtime}
          </p>
        </div>
      )}
    </div>
  );
};

const containerStyle = {
  maxWidth: '600px',
  margin: '30px auto',
  padding: '20px',
  backgroundColor: '#f9f9f9',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const titleCardStyle = {
  textAlign: 'center',
  marginBottom: '20px',
};

const titleStyle = {
  fontSize: '24px',
  fontWeight: 'bold',
};

const descStyle = {
  fontSize: '14px',
  color: '#666',
};

const cardStyle = {
  display: 'flex',
  marginBottom: '20px',
};

const inputStyle = {
  flexGrow: 1,
  padding: '10px',
  fontSize: '16px',
  border: '2px solid #ddd',
  borderRadius: '5px 0 0 5px',
};

const buttonStyle = (loading) => ({
  padding: '10px 15px',
  backgroundColor: loading ? '#cccccc' : '#0A6847',
  color: 'white',
  border: 'none',
  borderRadius: '0 5px 5px 0',
  cursor: loading ? 'not-allowed' : 'pointer',
});

const errorStyle = {
  color: '#D32F2F',
  textAlign: 'center',
  padding: '10px',
  backgroundColor: '#ffeeee',
  borderRadius: '5px',
  marginBottom: '15px',
};

const outputStyle = {
  textAlign: 'center',
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
};

const cityNameStyle = { fontSize: '18px', fontWeight: 'bold' };
const countryNameStyle = { color: '#555' };
const tempCardStyle = { fontSize: '48px', fontWeight: 'bold', color: '#0A6847' };
const tempStyle = { display: 'inline-block' };
const supStyle = { verticalAlign: 'top' };
const timeStyle = { color: '#777', marginTop: '10px' };

export default WeatherApp;
