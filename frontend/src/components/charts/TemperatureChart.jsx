import { useSelector } from 'react-redux';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TemperatureChart = ({ hourlyData }) => {
  const { unit_pref } = useSelector((state) => state.settings);

  if (!hourlyData || hourlyData.length === 0) return null;

  const data = hourlyData.map((h) => ({
    time: new Date(h.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    temp: unit_pref === 'fahrenheit' ? h.temp_f : h.temp_c,
    feels: unit_pref === 'fahrenheit' ? h.feelslike_f : h.feelslike_c,
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-surface-300 mb-4">Temperature Today</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} unit="°" />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
            labelStyle={{ color: '#94a3b8' }}
          />
          <Area type="monotone" dataKey="temp" stroke="#3b82f6" fill="url(#tempGrad)" strokeWidth={2} name="Temp" />
          <Area type="monotone" dataKey="feels" stroke="#8b5cf6" fill="none" strokeWidth={1.5} strokeDasharray="5 5" name="Feels like" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
