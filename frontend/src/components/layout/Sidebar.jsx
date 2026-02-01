import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiStar, HiTrash, HiMapPin } from 'react-icons/hi2';
import { fetchFavorites, removeFavorite } from '../../store/slices/favoriteSlice';
import { setSelectedCity, fetchCurrentWeather, fetchForecast } from '../../store/slices/weatherSlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.favorites);
  const { selectedCity, loading: weatherLoading } = useSelector((state) => state.weather);
  const { quota } = useSelector((state) => state.weather);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    dispatch(fetchFavorites());
  }, [dispatch]);

  const handleSelect = (city) => {
    const cityName = city.city_name;
    dispatch(setSelectedCity(cityName));
    dispatch(fetchCurrentWeather(cityName));
    dispatch(fetchForecast({ city: cityName }));
  };

  const handleRemove = async (e, id) => {
    e.stopPropagation();
    setRemovingId(id);
    await dispatch(removeFavorite(id));
    setRemovingId(null);
  };

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="sticky top-20 space-y-4">
        {/* Quota Card */}
        {quota && (
          <div className="card">
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">API Usage</h3>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-surface-300">{quota.used} / {quota.limit}</span>
              <span className="text-surface-400">{quota.percentage_used}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${quota.percentage_used > 80 ? 'bg-red-400' : quota.percentage_used > 50 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                style={{ width: `${Math.min(quota.percentage_used, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Favorites */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <HiStar className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-surface-400 uppercase tracking-wider">Favorites</h3>
          </div>

          {loading ? (
            <p className="text-surface-500 text-sm">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-surface-500 text-sm">No favorites yet. Search and add cities!</p>
          ) : (
            <div className="space-y-1">
              {items.map((fav) => (
                <button
                  key={fav.id}
                  onClick={() => handleSelect(fav)}
                  disabled={weatherLoading || removingId === fav.id}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors group disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedCity === fav.city_name ? 'bg-primary-500/20 text-primary-300' : 'hover:bg-white/5 text-surface-300'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <HiMapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{fav.city_name}</span>
                  </div>
                  <HiTrash
                    onClick={(e) => handleRemove(e, fav.id)}
                    className="w-3.5 h-3.5 text-surface-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
