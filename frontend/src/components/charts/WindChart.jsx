import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const WindChart = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) return null;

  const data = hourlyData.map((h) => ({
    time: new Date(h.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    wind: Math.round(h.wind_kph),
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-surface-300 mb-4">Wind Speed</h3>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} unit=" km/h" />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
          />
          <Line type="monotone" dataKey="wind" stroke="#10b981" strokeWidth={2} dot={false} name="Wind" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WindChart;
