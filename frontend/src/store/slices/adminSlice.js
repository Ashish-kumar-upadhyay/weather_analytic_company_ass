import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminApi } from '../../services/adminApi';

export const fetchAdminUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const res = await adminApi.getUsers();
    return res.data.data.users;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch users');
  }
});

export const fetchQuotaStats = createAsyncThunk('admin/fetchQuotaStats', async (_, { rejectWithValue }) => {
  try {
    const res = await adminApi.getQuotaStats();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch quota stats');
  }
});

export const fetchQuotaPool = createAsyncThunk('admin/fetchQuotaPool', async (_, { rejectWithValue }) => {
  try {
    const res = await adminApi.getQuotaPool();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch quota pool');
  }
});

export const updateUserLimit = createAsyncThunk('admin/updateUserLimit', async ({ id, dailyLimit }, { rejectWithValue }) => {
  try {
    const res = await adminApi.updateUserLimit(id, dailyLimit);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update user limit');
  }
});

export const fetchAdminConfig = createAsyncThunk('admin/fetchConfig', async (_, { rejectWithValue }) => {
  try {
    const res = await adminApi.getConfig();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch config');
  }
});

export const updateAdminConfig = createAsyncThunk('admin/updateConfig', async ({ key, value }, { rejectWithValue }) => {
  try {
    const res = await adminApi.updateConfig(key, value);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update config');
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    quotaStats: null,
    quotaPool: null,
    config: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAdminUsers.pending, (state) => { state.loading = true; });
    builder.addCase(fetchAdminUsers.fulfilled, (state, action) => { state.loading = false; state.users = action.payload; });
    builder.addCase(fetchAdminUsers.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    builder.addCase(fetchQuotaStats.fulfilled, (state, action) => { state.quotaStats = action.payload; });
    builder.addCase(fetchQuotaPool.fulfilled, (state, action) => { state.quotaPool = action.payload; });
    builder.addCase(fetchAdminConfig.fulfilled, (state, action) => { state.config = action.payload; });

    builder.addCase(updateAdminConfig.fulfilled, (state, action) => {
      if (state.config) {
        state.config.computed = action.payload.computed;
      }
    });
  },
});

export default adminSlice.reducer;
