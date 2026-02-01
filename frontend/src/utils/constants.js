export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const WEATHER_ICONS = {
  1000: '☀️', 1003: '⛅', 1006: '☁️', 1009: '☁️',
  1030: '🌫️', 1063: '🌦️', 1066: '🌨️', 1069: '🌨️',
  1072: '🌧️', 1087: '⛈️', 1114: '❄️', 1117: '🌨️',
  1135: '🌫️', 1147: '🌫️', 1150: '🌧️', 1153: '🌧️',
  1168: '🌧️', 1171: '🌧️', 1180: '🌧️', 1183: '🌧️',
  1186: '🌧️', 1189: '🌧️', 1192: '🌧️', 1195: '🌧️',
  1198: '🌧️', 1201: '🌧️', 1204: '🌨️', 1207: '🌨️',
  1210: '🌨️', 1213: '🌨️', 1216: '🌨️', 1219: '🌨️',
  1222: '❄️', 1225: '❄️', 1237: '🌨️', 1240: '🌧️',
  1243: '🌧️', 1246: '🌧️', 1249: '🌨️', 1252: '🌨️',
  1255: '🌨️', 1258: '🌨️', 1261: '🌨️', 1264: '🌨️',
  1273: '⛈️', 1276: '⛈️', 1279: '⛈️', 1282: '⛈️',
};

export const CONDITION_GRADIENTS = {
  sunny: 'from-amber-500/20 to-orange-500/10',
  cloudy: 'from-slate-500/20 to-gray-500/10',
  rainy: 'from-blue-500/20 to-cyan-500/10',
  snowy: 'from-blue-200/20 to-white/10',
  stormy: 'from-purple-500/20 to-slate-500/10',
  foggy: 'from-gray-400/20 to-slate-400/10',
  default: 'from-primary-500/20 to-blue-500/10',
};

export const getConditionType = (code) => {
  if (code === 1000) return 'sunny';
  if ([1003, 1006, 1009].includes(code)) return 'cloudy';
  if ([1030, 1135, 1147].includes(code)) return 'foggy';
  if (code >= 1063 && code <= 1201) return 'rainy';
  if (code >= 1204 && code <= 1264) return 'snowy';
  if (code >= 1273) return 'stormy';
  return 'default';
};
