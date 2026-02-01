import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { weatherApi } from '../../services/weatherApi';

export const fetchCurrentWeather = createAsyncThunk('weather/fetchCurrent', async (city, { rejectWithValue }) => {
  try {
    const res = await weatherApi.getCurrentWeather(city);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch weather');
  }
});

export const fetchForecast = createAsyncThunk('weather/fetchForecast', async ({ city, days = 3 }, { rejectWithValue }) => {
  try {
    const res = await weatherApi.getForecast(city, days);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch forecast');
  }
});

export const searchCities = createAsyncThunk('weather/searchCities', async (query, { rejectWithValue }) => {
  try {
    const res = await weatherApi.searchCity(query);
    return res.data.data.cities;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Search failed');
  }
});

export const fetchQuota = createAsyncThunk('weather/fetchQuota', async (_, { rejectWithValue }) => {
  try {
    const res = await weatherApi.getQuota();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch quota');
  }
});

const weatherSlice = createSlice({
  name: 'weather',
  initialState: {
    current: null,
    forecast: null,
    searchResults: [],
    quota: null,
    selectedCity: 'Delhi',
    loading: false,
    searchLoading: false,
    error: null,
  },
  reducers: {
    setSelectedCity: (state, action) => {
      state.selectedCity = action.payload;
    },
    clearSearch: (state) => {
      state.searchResults = [];
    },
    clearWeather: (state) => {
      state.current = null;
      state.forecast = null;
    },
  },
  extraReducers: (builder) => {
    // Current weather
    builder.addCase(fetchCurrentWeather.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchCurrentWeather.fulfilled, (state, action) => {
      state.loading = false;
      state.current = action.payload;
    });
    builder.addCase(fetchCurrentWeather.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // Forecast
    builder.addCase(fetchForecast.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(fetchForecast.fulfilled, (state, action) => {
      state.loading = false;
      state.forecast = action.payload;
    });
    builder.addCase(fetchForecast.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // Search
    builder.addCase(searchCities.pending, (state) => { state.searchLoading = true; });
    builder.addCase(searchCities.fulfilled, (state, action) => {
      state.searchLoading = false;
      state.searchResults = action.payload;
    });
    builder.addCase(searchCities.rejected, (state) => { state.searchLoading = false; state.searchResults = []; });

    // Quota
    builder.addCase(fetchQuota.fulfilled, (state, action) => { state.quota = action.payload; });
  },
});

export const { setSelectedCity, clearSearch, clearWeather } = weatherSlice.actions;
export default weatherSlice.reducer;
