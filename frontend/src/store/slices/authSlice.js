import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../services/authApi';
import { setToken, removeToken, getToken } from '../../utils/helpers';

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.register(data);
    setToken(res.data.data.token);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.login(data);
    setToken(res.data.data.token);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const googleLogin = createAsyncThunk('auth/googleLogin', async (accessToken, { rejectWithValue }) => {
  try {
    const res = await authApi.googleLogin(accessToken);
    setToken(res.data.data.token);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Google login failed');
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) return rejectWithValue('No token');
    const res = await authApi.getMe();
    return res.data.data;
  } catch (err) {
    removeToken();
    return rejectWithValue(err.response?.data?.message || 'Session expired');
  }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    const res = await authApi.forgotPassword(email);
    return res.data.message;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to send reset email');
  }
});

export const resetPassword = createAsyncThunk('auth/resetPassword', async (data, { rejectWithValue }) => {
  try {
    const res = await authApi.resetPassword(data);
    return res.data.message;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Password reset failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: getToken(),
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    logout: (state) => {
      removeToken();
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(register.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // Login
    builder.addCase(login.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // Google Login
    builder.addCase(googleLogin.pending, (state) => { state.loading = true; state.error = null; });
    builder.addCase(googleLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
    });
    builder.addCase(googleLogin.rejected, (state, action) => { state.loading = false; state.error = action.payload; });

    // Fetch Me
    builder.addCase(fetchMe.pending, (state) => { state.loading = true; });
    builder.addCase(fetchMe.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.initialized = true;
    });
    builder.addCase(fetchMe.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.initialized = true;
    });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
