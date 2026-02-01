import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import weatherReducer from './slices/weatherSlice';
import favoriteReducer from './slices/favoriteSlice';
import settingsReducer from './slices/settingsSlice';
import adminReducer from './slices/adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    favorites: favoriteReducer,
    settings: settingsReducer,
    admin: adminReducer,
  },
});

export default store;
