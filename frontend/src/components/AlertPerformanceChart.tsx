// frontend/src/components/AlertPerformanceChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AlertPerformanceChart({ data }: { data: any[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm">
      <h3 className="text-xl font-bold mb-4">Histórico de Alertas</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="alerts" stroke="#4f46e5" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}