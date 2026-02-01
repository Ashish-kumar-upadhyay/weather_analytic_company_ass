import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { favoritesApi } from '../../services/weatherApi';

export const fetchFavorites = createAsyncThunk('favorites/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await favoritesApi.getAll();
    return res.data.data.favorites;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch favorites');
  }
});

export const addFavorite = createAsyncThunk('favorites/add', async (data, { rejectWithValue }) => {
  try {
    const res = await favoritesApi.add(data);
    return res.data.data.favorite;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to add favorite');
  }
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (id, { rejectWithValue }) => {
  try {
    await favoritesApi.remove(id);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to remove favorite');
  }
});

const favoriteSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFavorites.pending, (state) => { state.loading = true; });
    builder.addCase(fetchFavorites.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
    });
    builder.addCase(fetchFavorites.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    builder.addCase(addFavorite.fulfilled, (state, action) => { state.items.push(action.payload); });
    builder.addCase(removeFavorite.fulfilled, (state, action) => {
      state.items = state.items.filter((f) => f.id !== action.payload);
    });
  },
});

export default favoriteSlice.reducer;
