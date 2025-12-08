import { TrendingUp, Clock, Trash2, Bell } from 'lucide-react';

interface Alert {
  id: number;
  ticker: string;
  alert_type: string;
  target_value: number;
  condition: string;
  is_active: boolean;
  triggered: boolean;
  created_at: string;
  triggered_at?: string;
}

interface AlertCardProps {
  alert: Alert;
  onDelete: (id: number) => void;
  isHistory?: boolean;
}

export function AlertCard({ alert, onDelete, isHistory = false }: AlertCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold">{alert.ticker}</h3>
      {/* Implementação completa aqui */}
    </div>
  );
}