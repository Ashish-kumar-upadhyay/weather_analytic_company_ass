import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiCloud, HiCog6Tooth, HiArrowRightOnRectangle, HiShieldCheck } from 'react-icons/hi2';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../store/slices/authSlice';
import SearchBar from '../common/SearchBar';

const Header = () => {
  const { user, isAdmin } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.weather);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <HiCloud className="w-7 h-7 text-primary-400" />
          <span className="font-display font-bold text-lg hidden sm:block">WeatherDash</span>
        </Link>

        <SearchBar />

        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <Link to="/admin" className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Admin">
              <HiShieldCheck className="w-5 h-5 text-amber-400" />
            </Link>
          )}
          <Link to="/settings" className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Settings">
            <HiCog6Tooth className="w-5 h-5 text-surface-300" />
          </Link>
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-surface-700 ml-1">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-sm font-semibold text-primary-300">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span className="text-sm text-surface-300 max-w-[100px] truncate">{user?.name?.split(' ')[0]}</span>
          </div>
          <button onClick={handleLogout} disabled={loading} className="p-2 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" title="Logout">
            <HiArrowRightOnRectangle className="w-5 h-5 text-surface-400 hover:text-red-400" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
