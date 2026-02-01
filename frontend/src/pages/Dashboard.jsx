import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineHeart as HiHeart, HiHeart as HiHeartSolid } from 'react-icons/hi';
import { WiHumidity, WiStrongWind, WiBarometer, WiDaySunny, WiCloud } from 'react-icons/wi';
import { fetchCurrentWeather, fetchForecast, fetchQuota } from '../store/slices/weatherSlice';
import { fetchFavorites, addFavorite, removeFavorite } from '../store/slices/favoriteSlice';
import { fetchSettings } from '../store/slices/settingsSlice';
import { useAuth } from '../hooks/useAuth';
import { formatTemp, formatWind, getGreeting } from '../utils/helpers';
import { WEATHER_ICONS, getConditionType, CONDITION_GRADIENTS } from '../utils/constants';
import StatCard from '../components/cards/StatCard';
import ForecastCard from '../components/cards/ForecastCard';
import HourlyForecastCard from '../components/cards/HourlyForecastCard';
import TemperatureChart from '../components/charts/TemperatureChart';
import PrecipitationChart from '../components/charts/PrecipitationChart';
import WindChart from '../components/charts/WindChart';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { current, forecast, selectedCity, loading, error } = useSelector((state) => state.weather);
  const { items: favorites } = useSelector((state) => state.favorites);
  const { unit_pref } = useSelector((state) => state.settings);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchSettings());
    dispatch(fetchFavorites());
    dispatch(fetchQuota());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCity) {
      dispatch(fetchCurrentWeather(selectedCity));
      dispatch(fetchForecast({ city: selectedCity }));
    }
  }, [selectedCity, dispatch]);

  const isFavorited = favorites.some((f) => f.city_name === current?.location?.name);

  const toggleFavorite = async () => {
    if (!current || favoriteLoading) return;
    setFavoriteLoading(true);
    const existing = favorites.find((f) => f.city_name === current.location.name);
    if (existing) {
      await dispatch(removeFavorite(existing.id));
    } else {
      await dispatch(addFavorite({
        city_name: current.location.name,
        country: current.location.country,
        lat: current.location.lat,
        lon: current.location.lon,
      }));
    }
    setFavoriteLoading(false);
  };

  if (loading && !current) return <Loader size="lg" text="Fetching weather..." />;
  if (error && !current) return <ErrorMessage message={error} onRetry={() => dispatch(fetchCurrentWeather(selectedCity))} />;

  const conditionType = current ? getConditionType(current.current.condition.code) : 'default';
  const gradient = CONDITION_GRADIENTS[conditionType] || CONDITION_GRADIENTS.default;
  const weatherIcon = current ? WEATHER_ICONS[current.current.condition.code] || '🌤️' : '🌤️';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div>
        <h1 className="font-display font-bold text-2xl sm:text-3xl">
          {getGreeting()}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>
        </h1>
        <p className="text-surface-400 text-sm mt-1">Here's your weather overview</p>
      </div>

      {/* Main Weather Card */}
      {current && (
        <div className={`card bg-gradient-to-br ${gradient} relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="text-6xl sm:text-7xl">{weatherIcon}</div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-display font-bold text-4xl sm:text-5xl">
                    {formatTemp(current.current.temp_c, current.current.temp_f, unit_pref)}
                  </h2>
                  <button onClick={toggleFavorite} disabled={favoriteLoading} className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    {isFavorited ? <HiHeartSolid className="w-6 h-6 text-red-400" /> : <HiHeart className="w-6 h-6 text-surface-400" />}
                  </button>
                </div>
                <p className="text-surface-300 text-lg">{current.current.condition.text}</p>
                <p className="text-surface-400 text-sm mt-1">
                  {current.location.name}, {current.location.country} • Feels like {formatTemp(current.current.feelslike_c, current.current.feelslike_f, unit_pref)}
                </p>
              </div>
            </div>

            <div className="text-right text-sm text-surface-400">
              <p>{current.location.localtime}</p>
              <p>UV Index: {current.current.uv}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      {current && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<WiHumidity className="w-6 h-6 text-cyan-400" />} label="Humidity" value={`${current.current.humidity}%`} />
          <StatCard icon={<WiStrongWind className="w-6 h-6 text-teal-400" />} label="Wind" value={formatWind(current.current.wind_kph, unit_pref)} sub={current.current.wind_dir} />
          <StatCard icon={<WiBarometer className="w-6 h-6 text-violet-400" />} label="Pressure" value={`${current.current.pressure_mb} mb`} />
          <StatCard icon={<WiDaySunny className="w-6 h-6 text-amber-400" />} label="Visibility" value={`${current.current.vis_km} km`} />
        </div>
      )}

      {/* Hourly Forecast */}
      {forecast && forecast.forecast.length > 0 && (
        <>
          <h2 className="font-display font-semibold text-lg">Hourly Forecast</h2>

          {/* Day Tabs */}
          <div className="flex gap-2 mb-4">
            {forecast.forecast.map((day, index) => {
              const date = new Date(day.date);
              const dayLabel = index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDayIndex(index)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedDayIndex === index
                      ? 'bg-primary-500 text-white'
                      : 'glass hover:bg-white/10 text-surface-300'
                  }`}
                >
                  {dayLabel}
                </button>
              );
            })}
          </div>

          {/* Hourly Cards */}
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-surface-700 scrollbar-track-transparent">
              {forecast.forecast[selectedDayIndex].hour.map((hour, index) => (
                <HourlyForecastCard key={index} hour={hour} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* 3-Day Forecast */}
      {forecast && (
        <>
          <h2 className="font-display font-semibold text-lg">3-Day Forecast</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {forecast.forecast.map((day) => (
              <ForecastCard key={day.date} day={day} />
            ))}
          </div>
        </>
      )}

      {/* Charts */}
      {forecast && forecast.forecast[0] && (
        <>
          <h2 className="font-display font-semibold text-lg">Today's Details</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TemperatureChart hourlyData={forecast.forecast[0].hour} />
            <PrecipitationChart hourlyData={forecast.forecast[0].hour} />
          </div>
          <WindChart hourlyData={forecast.forecast[0].hour} />
        </>
      )}
    </div>
  );
};

export default Dashboard;
