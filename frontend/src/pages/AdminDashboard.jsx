import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiShieldCheck, HiUsers, HiChartBar, HiCog6Tooth, HiPencil, HiCheck, HiXMark } from 'react-icons/hi2';
import { fetchAdminUsers, fetchQuotaStats, fetchQuotaPool, fetchAdminConfig, updateUserLimit, updateAdminConfig } from '../store/slices/adminSlice';
import Loader from '../components/common/Loader';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, quotaStats, quotaPool, config, loading } = useSelector((state) => state.admin);
  const [editingUser, setEditingUser] = useState(null);
  const [editLimit, setEditLimit] = useState('');
  const [editingConfig, setEditingConfig] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [tab, setTab] = useState('users');

  useEffect(() => {
    dispatch(fetchAdminUsers());
    dispatch(fetchQuotaStats());
    dispatch(fetchQuotaPool());
    dispatch(fetchAdminConfig());
  }, [dispatch]);

  const handleUpdateLimit = async (userId) => {
    await dispatch(updateUserLimit({ id: userId, dailyLimit: parseInt(editLimit) }));
    setEditingUser(null);
    dispatch(fetchAdminUsers());
    dispatch(fetchQuotaPool());
  };

  const handleUpdateConfig = async (key) => {
    await dispatch(updateAdminConfig({ key, value: parseInt(editValue) }));
    setEditingConfig(null);
    dispatch(fetchAdminConfig());
    dispatch(fetchQuotaStats());
    dispatch(fetchQuotaPool());
  };

  if (loading && !users.length) return <Loader size="lg" text="Loading admin data..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <HiShieldCheck className="w-7 h-7 text-amber-400" />
        <h1 className="font-display font-bold text-2xl">Admin Dashboard</h1>
      </div>

      {/* Stats Cards */}
      {quotaStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="card text-center">
            <p className="text-2xl font-display font-bold text-primary-400">{quotaStats.project_cap}</p>
            <p className="text-xs text-surface-400">Project Cap</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-display font-bold text-emerald-400">{quotaStats.remaining_hits}</p>
            <p className="text-xs text-surface-400">Remaining Hits</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-display font-bold text-amber-400">{quotaStats.total_hits_24hr}</p>
            <p className="text-xs text-surface-400">Used (24hr)</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-display font-bold text-cyan-400">{quotaPool?.remaining || 0}</p>
            <p className="text-xs text-surface-400">Assignable Left</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-800/50 p-1 rounded-xl w-fit">
        {[
          { id: 'users', label: 'Users', icon: HiUsers },
          { id: 'config', label: 'Config', icon: HiCog6Tooth },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.id ? 'bg-primary-500 text-white' : 'text-surface-400 hover:text-white'
            }`}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700 text-xs text-surface-400 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">User</th>
                  <th className="text-left px-5 py-3">Role</th>
                  <th className="text-center px-5 py-3">Limit</th>
                  <th className="text-center px-5 py-3">Used</th>
                  <th className="text-center px-5 py-3">Remaining</th>
                  <th className="text-center px-5 py-3">Usage %</th>
                  <th className="text-center px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-surface-800 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-surface-400">{u.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : 'bg-surface-700 text-surface-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-sm">
                      {editingUser === u.id ? (
                        <input type="number" value={editLimit} onChange={(e) => setEditLimit(e.target.value)} className="w-20 bg-surface-700 border border-surface-500 rounded px-2 py-1 text-center text-sm" autoFocus />
                      ) : (
                        u.userLimit?.daily_limit ?? 0
                      )}
                    </td>
                    <td className="px-5 py-3 text-center text-sm">{u.usage?.used ?? 0}</td>
                    <td className="px-5 py-3 text-center text-sm text-emerald-400">{u.usage?.remaining ?? 0}</td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${(u.usage?.percentage_used ?? 0) > 80 ? 'bg-red-400' : 'bg-primary-400'}`}
                            style={{ width: `${Math.min(u.usage?.percentage_used ?? 0, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-surface-400">{u.usage?.percentage_used ?? 0}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-center">
                      {editingUser === u.id ? (
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleUpdateLimit(u.id)} disabled={loading} className="p-1 rounded hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"><HiCheck className="w-4 h-4 text-emerald-400" /></button>
                          <button onClick={() => setEditingUser(null)} disabled={loading} className="p-1 rounded hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"><HiXMark className="w-4 h-4 text-red-400" /></button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingUser(u.id); setEditLimit(u.userLimit?.daily_limit ?? 0); }} disabled={loading} className="p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">
                          <HiPencil className="w-4 h-4 text-surface-400" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Config Tab */}
      {tab === 'config' && config && (
        <div className="space-y-4">
          {/* Computed Values */}
          {config.computed && (
            <div className="card">
              <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-3">Computed Values</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-display font-bold text-primary-400">{config.computed.PROJECT_CAP}</p>
                  <p className="text-xs text-surface-400">Project Cap</p>
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-emerald-400">{config.computed.ASSIGNABLE_POOL}</p>
                  <p className="text-xs text-surface-400">Assignable Pool</p>
                </div>
                <div>
                  <p className="text-xl font-display font-bold text-amber-400">{config.computed.RESERVED_BUFFER}</p>
                  <p className="text-xs text-surface-400">Reserved Buffer</p>
                </div>
              </div>
            </div>
          )}

          {/* Config Table */}
          <div className="card overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-700 text-xs text-surface-400 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Setting</th>
                  <th className="text-left px-5 py-3">Description</th>
                  <th className="text-center px-5 py-3">Value</th>
                  <th className="text-center px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {config.configs?.map((c) => (
                  <tr key={c.key} className="border-b border-surface-800 hover:bg-white/5">
                    <td className="px-5 py-3 font-mono text-sm text-primary-300">{c.key}</td>
                    <td className="px-5 py-3 text-sm text-surface-400">{c.description}</td>
                    <td className="px-5 py-3 text-center">
                      {editingConfig === c.key ? (
                        <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="w-24 bg-surface-700 border border-surface-500 rounded px-2 py-1 text-center text-sm" autoFocus />
                      ) : (
                        <span className="font-mono font-semibold">{c.value}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-center">
                      {editingConfig === c.key ? (
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => handleUpdateConfig(c.key)} disabled={loading} className="p-1 rounded hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"><HiCheck className="w-4 h-4 text-emerald-400" /></button>
                          <button onClick={() => setEditingConfig(null)} disabled={loading} className="p-1 rounded hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"><HiXMark className="w-4 h-4 text-red-400" /></button>
                        </div>
                      ) : (
                        <button onClick={() => { setEditingConfig(c.key); setEditValue(c.value); }} disabled={loading} className="p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed">
                          <HiPencil className="w-4 h-4 text-surface-400" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
