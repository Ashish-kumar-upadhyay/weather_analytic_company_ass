import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiMagnifyingGlass, HiXMark, HiMapPin } from 'react-icons/hi2';
import { searchCities, clearSearch, setSelectedCity, fetchCurrentWeather, fetchForecast } from '../../store/slices/weatherSlice';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const dispatch = useDispatch();
  const { searchResults, searchLoading, loading } = useSelector((state) => state.weather);
  const debouncedQuery = useDebounce(query, 300);
  const ref = useRef(null);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      dispatch(searchCities(debouncedQuery));
      setShowDropdown(true);
    } else {
      dispatch(clearSearch());
      setShowDropdown(false);
    }
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (city) => {
    const cityName = `${city.name}, ${city.country}`;
    dispatch(setSelectedCity(cityName));
    dispatch(fetchCurrentWeather(cityName));
    dispatch(fetchForecast({ city: cityName }));
    setQuery('');
    setShowDropdown(false);
    dispatch(clearSearch());
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coordinates = `${latitude},${longitude}`;

        dispatch(setSelectedCity(coordinates));
        dispatch(fetchCurrentWeather(coordinates));
        dispatch(fetchForecast({ city: coordinates }));

        setGettingLocation(false);
      },
      () => {
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <div ref={ref} className="relative w-full max-w-md flex gap-2">
      <div className="relative flex-1">
        <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
          className="input-field pl-10 pr-10 py-2.5 text-sm"
        />
        {query && (
          <button onClick={() => { setQuery(''); dispatch(clearSearch()); }} className="absolute right-3 top-1/2 -translate-y-1/2">
            <HiXMark className="w-4 h-4 text-surface-400 hover:text-white" />
          </button>
        )}
      </div>

      {/* Current Location Button */}
      <button
        onClick={handleCurrentLocation}
        disabled={gettingLocation || loading}
        className="p-2.5 glass rounded-xl hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Use current location"
      >
        <HiMapPin className="w-4 h-4 text-primary-400" />
      </button>

      {showDropdown && (searchResults.length > 0 || searchLoading) && (
        <div className="absolute z-50 left-0 right-12 mt-2 glass rounded-xl overflow-hidden animate-slide-down">
          {searchLoading ? (
            <div className="p-3 text-center text-surface-400 text-sm">Searching...</div>
          ) : (
            searchResults.map((city) => (
              <button
                key={city.id}
                onClick={() => handleSelect(city)}
                disabled={loading}
                className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-sm font-medium">{city.name}</span>
                <span className="text-xs text-surface-400">{city.region}, {city.country}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
