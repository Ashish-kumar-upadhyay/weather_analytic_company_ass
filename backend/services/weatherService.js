const axios = require("axios");
const { WEATHER_API_BASE, WEATHER_API_KEY } = require("../config/constants");

const weatherApi = axios.create({
  baseURL: WEATHER_API_BASE,
  params: {
    key: WEATHER_API_KEY,
  },
  timeout: 10000,
});

/**
 * Get current weather for a city
 */
const getCurrentWeather = async (city) => {
  const response = await weatherApi.get("/current.json", {
    params: { q: city, aqi: "yes" },
  });

  const { location, current } = response.data;

  return {
    location: {
      name: location.name,
      region: location.region,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
      localtime: location.localtime,
    },
    current: {
      temp_c: current.temp_c,
      temp_f: current.temp_f,
      condition: {
        text: current.condition.text,
        icon: current.condition.icon,
        code: current.condition.code,
      },
      wind_mph: current.wind_mph,
      wind_kph: current.wind_kph,
      wind_dir: current.wind_dir,
      pressure_mb: current.pressure_mb,
      humidity: current.humidity,
      cloud: current.cloud,
      feelslike_c: current.feelslike_c,
      feelslike_f: current.feelslike_f,
      uv: current.uv,
      dewpoint_c: current.dewpoint_c,
      dewpoint_f: current.dewpoint_f,
      vis_km: current.vis_km,
      air_quality: current.air_quality || null,
    },
  };
};

/**
 * Get forecast for a city (up to 3 days on free tier)
 */
const getForecast = async (city, days = 3) => {
  const response = await weatherApi.get("/forecast.json", {
    params: { q: city, days: Math.min(days, 3), aqi: "yes", alerts: "yes" },
  });

  const { location, current, forecast, alerts } = response.data;

  return {
    location: {
      name: location.name,
      region: location.region,
      country: location.country,
      lat: location.lat,
      lon: location.lon,
      localtime: location.localtime,
    },
    current: {
      temp_c: current.temp_c,
      temp_f: current.temp_f,
      condition: {
        text: current.condition.text,
        icon: current.condition.icon,
        code: current.condition.code,
      },
      humidity: current.humidity,
      wind_kph: current.wind_kph,
      wind_dir: current.wind_dir,
      uv: current.uv,
    },
    forecast: forecast.forecastday.map((day) => ({
      date: day.date,
      day: {
        maxtemp_c: day.day.maxtemp_c,
        maxtemp_f: day.day.maxtemp_f,
        mintemp_c: day.day.mintemp_c,
        mintemp_f: day.day.mintemp_f,
        avgtemp_c: day.day.avgtemp_c,
        avgtemp_f: day.day.avgtemp_f,
        condition: {
          text: day.day.condition.text,
          icon: day.day.condition.icon,
          code: day.day.condition.code,
        },
        maxwind_kph: day.day.maxwind_kph,
        totalprecip_mm: day.day.totalprecip_mm,
        avghumidity: day.day.avghumidity,
        daily_chance_of_rain: day.day.daily_chance_of_rain,
        daily_chance_of_snow: day.day.daily_chance_of_snow,
        uv: day.day.uv,
      },
      astro: {
        sunrise: day.astro.sunrise,
        sunset: day.astro.sunset,
        moonrise: day.astro.moonrise,
        moonset: day.astro.moonset,
        moon_phase: day.astro.moon_phase,
      },
      hour: day.hour.map((h) => ({
        time: h.time,
        temp_c: h.temp_c,
        temp_f: h.temp_f,
        condition: {
          text: h.condition.text,
          icon: h.condition.icon,
          code: h.condition.code,
        },
        wind_kph: h.wind_kph,
        wind_dir: h.wind_dir,
        humidity: h.humidity,
        chance_of_rain: h.chance_of_rain,
        chance_of_snow: h.chance_of_snow,
        feelslike_c: h.feelslike_c,
        feelslike_f: h.feelslike_f,
        uv: h.uv,
      })),
    })),
    alerts: alerts ? alerts.alert : [],
  };
};

/**
 * Search/autocomplete cities
 */
const searchCity = async (query) => {
  const response = await weatherApi.get("/search.json", {
    params: { q: query },
  });

  return response.data.map((city) => ({
    id: city.id,
    name: city.name,
    region: city.region,
    country: city.country,
    lat: city.lat,
    lon: city.lon,
    url: city.url,
  }));
};

module.exports = {
  getCurrentWeather,
  getForecast,
  searchCity,
};
