import { HiMapPin } from 'react-icons/hi2';

const CityCard = ({ city, onClick }) => (
  <button
    onClick={onClick}
    className="card hover:bg-white/10 transition-all duration-300 text-left w-full group"
  >
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-1.5 text-surface-400 text-xs mb-1">
          <HiMapPin className="w-3 h-3" />
          <span>{city.country}</span>
        </div>
        <h3 className="font-display font-semibold text-lg group-hover:text-primary-300 transition-colors">
          {city.city_name}
        </h3>
      </div>
    </div>
  </button>
);

export default CityCard;
