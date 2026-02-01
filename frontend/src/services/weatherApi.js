import api from './api';

export const weatherApi = {
  getCurrentWeather: (city) => api.get(`/weather/current?city=${encodeURIComponent(city)}`),
  getForecast: (city, days = 3) => api.get(`/weather/forecast?city=${encodeURIComponent(city)}&days=${days}`),
  searchCity: (query) => api.get(`/weather/search?q=${encodeURIComponent(query)}`),
  getQuota: () => api.get('/weather/quota'),
};

export const favoritesApi = {
  getAll: () => api.get('/favorites'),
  add: (data) => api.post('/favorites', data),
  remove: (id) => api.delete(`/favorites/${id}`),
};

export const settingsApi = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
};
