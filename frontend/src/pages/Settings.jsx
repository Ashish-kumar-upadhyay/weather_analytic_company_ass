import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiUser, HiCog6Tooth } from 'react-icons/hi2';
import { fetchSettings, updateSettings } from '../store/slices/settingsSlice';
import { fetchQuota } from '../store/slices/weatherSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const quota = useSelector((state) => state.weather.quota);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('celsius');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchSettings());
    dispatch(fetchQuota());
  }, [dispatch]);

  useEffect(() => {
    setName(settings.name || '');
    setUnit(settings.unit_pref || 'celsius');
  }, [settings]);

  const handleSave = async () => {
    setSaving(true);
    await dispatch(updateSettings({ name, unit_pref: unit }));
    setSaving(false);
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      <h1 className="font-display font-bold text-2xl flex items-center gap-2">
        <HiCog6Tooth className="w-6 h-6 text-surface-400" />
        Settings
      </h1>

      {/* Profile */}
      <div className="card">
        <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">Profile</h2>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-500/20 flex items-center justify-center">
            {settings.avatar_url ? (
              <img src={settings.avatar_url} alt="" className="w-14 h-14 rounded-full object-cover" />
            ) : (
              <HiUser className="w-7 h-7 text-primary-300" />
            )}
          </div>
          <div>
            <p className="font-medium">{settings.name}</p>
            <p className="text-surface-400 text-sm">{settings.email}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-surface-400 mb-1.5">Display Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="card">
        <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">Preferences</h2>
        <div>
          <label className="block text-sm text-surface-400 mb-2">Temperature Unit</label>
          <div className="flex gap-3">
            {['celsius', 'fahrenheit'].map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  unit === u ? 'bg-primary-500 text-white' : 'bg-surface-800 text-surface-300 hover:bg-surface-700'
                }`}
              >
                {u === 'celsius' ? '°C Celsius' : '°F Fahrenheit'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Quota Info */}
      {quota && (
        <div className="card">
          <h2 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">API Quota</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-display font-bold text-primary-400">{quota.used}</p>
              <p className="text-xs text-surface-400">Used</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-emerald-400">{quota.remaining}</p>
              <p className="text-xs text-surface-400">Remaining</p>
            </div>
            <div>
              <p className="text-2xl font-display font-bold text-surface-300">{quota.limit}</p>
              <p className="text-xs text-surface-400">Daily Limit</p>
            </div>
          </div>
          <div className="w-full h-2 bg-surface-700 rounded-full overflow-hidden mt-4">
            <div
              className={`h-full rounded-full transition-all ${quota.percentage_used > 80 ? 'bg-red-400' : 'bg-primary-400'}`}
              style={{ width: `${Math.min(quota.percentage_used, 100)}%` }}
            />
          </div>
        </div>
      )}

      <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default Settings;
