import { formatTemp } from '../../utils/helpers';
import { useSelector } from 'react-redux';

const HourlyForecastCard = ({ hour }) => {
  const { unit_pref } = useSelector((state) => state.settings);

  // Extract hour from time string (e.g., "2024-01-15 07:00" -> "7 AM")
  const time = new Date(hour.time);
  const hourString = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true
  });

  return (
    <div className="card min-w-[90px] flex-shrink-0 text-center p-3 hover:bg-white/5 transition-colors">
      <p className="text-xs text-surface-400 mb-2">{hourString}</p>
      <div className="text-2xl mb-2">{hour.condition.icon ? <img src={hour.condition.icon} alt={hour.condition.text} className="w-10 h-10 mx-auto" /> : '🌤️'}</div>
      <p className="font-semibold text-lg mb-1">
        {formatTemp(hour.temp_c, hour.temp_f, unit_pref)}
      </p>
      <p className="text-xs text-surface-400">{hour.condition.text}</p>
      <div className="flex items-center justify-center gap-1 mt-2 text-xs text-cyan-400">
        <span>💧</span>
        <span>{hour.chance_of_rain}%</span>
      </div>
    </div>
  );
};

export default HourlyForecastCard;
