import { useSelector } from 'react-redux';
import { formatTemp, getDayName } from '../../utils/helpers';
import { WEATHER_ICONS } from '../../utils/constants';

const ForecastCard = ({ day }) => {
  const { unit_pref } = useSelector((state) => state.settings);
  const icon = WEATHER_ICONS[day.day.condition.code] || '🌤️';

  return (
    <div className="card hover:bg-white/10 transition-all duration-300 text-center cursor-default group">
      <p className="text-sm font-medium text-surface-300 mb-2">{getDayName(day.date)}</p>
      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{icon}</div>
      <p className="text-xs text-surface-400 mb-3">{day.day.condition.text}</p>
      <div className="flex justify-center gap-3 text-sm">
        <span className="font-semibold">{formatTemp(day.day.maxtemp_c, day.day.maxtemp_f, unit_pref)}</span>
        <span className="text-surface-500">{formatTemp(day.day.mintemp_c, day.day.mintemp_f, unit_pref)}</span>
      </div>
      <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs text-surface-400">
        <span>💧 {day.day.daily_chance_of_rain}%</span>
        <span>💨 {Math.round(day.day.maxwind_kph)} km/h</span>
      </div>
    </div>
  );
};

export default ForecastCard;
