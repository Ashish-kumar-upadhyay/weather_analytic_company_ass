import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PrecipitationChart = ({ hourlyData }) => {
  if (!hourlyData || hourlyData.length === 0) return null;

  const data = hourlyData.map((h) => ({
    time: new Date(h.time).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
    rain: parseInt(h.chance_of_rain),
    snow: parseInt(h.chance_of_snow),
  }));

  return (
    <div className="card">
      <h3 className="text-sm font-semibold text-surface-300 mb-4">Precipitation Chance</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
          />
          <Bar dataKey="rain" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Rain %" />
          <Bar dataKey="snow" fill="#a78bfa" radius={[4, 4, 0, 0]} name="Snow %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PrecipitationChart;
