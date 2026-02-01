import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { settingsApi } from '../../services/weatherApi';

export const fetchSettings = createAsyncThunk('settings/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await settingsApi.get();
    return res.data.data.settings;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch settings');
  }
});

export const updateSettings = createAsyncThunk('settings/update', async (data, { rejectWithValue }) => {
  try {
    const res = await settingsApi.update(data);
    return res.data.data.settings;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update settings');
  }
});

const settingsSlice = createSlice({
  name: 'settings',
  initialState: {
    unit_pref: 'celsius',
    name: '',
    email: '',
    avatar_url: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSettings.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
      state.loading = false;
    });
    builder.addCase(updateSettings.pending, (state) => { state.loading = true; });
    builder.addCase(updateSettings.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
      state.loading = false;
    });
    builder.addCase(updateSettings.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default settingsSlice.reducer;
