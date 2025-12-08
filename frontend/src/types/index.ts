// Tipos globais para o frontend

export type AlertType = 'price' | 'percentage' | 'volume';
export type Condition = 'gt' | 'lt' | 'gte' | 'lte'; // greater than, less than, greater or equal, less or equal

export interface Alert {
  id: number;
  ticker: string;
  alertType: AlertType;
  condition: Condition;
  targetValue: number;
  currentValue: number;
  status: 'active' | 'triggered' | 'history';
  createdAt: string; // ISO date string
  triggeredAt?: string; // ISO date string
  userId: number;
}

export interface AlertNotification {
  ticker: string;
  alertType: AlertType;
  condition: Condition;
  targetValue: number;
  message: string;
  timestamp: string;
}

export interface AlertPerformanceData {
  date: string;
  value: number;
}

export interface ColorMap {
  bg: string;
  border: string;
  text: string;
  hover: string;
  selected: string;
}

export type ColorKey = 'emerald' | 'amber' | 'purple';

export const ALERT_TYPE_MAP = {
  price: {
    icon: 'DollarSign', // Será substituído pelo componente real
    label: 'Preço Alvo',
    unit: 'R$',
    emoji: '💰',
  },
  percentage: {
    icon: 'TrendingUp', // Será substituído pelo componente real
    label: 'Variação Percentual',
    unit: '%',
    emoji: '📈',
  },
  volume: {
    icon: 'BarChart3', // Será substituído pelo componente real
    label: 'Volume de Negociação',
    unit: 'M',
    emoji: '📊',
  },
};

export const COLOR_MAP: Record<ColorKey, ColorMap> = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-600',
    hover: 'hover:bg-emerald-100',
    selected: 'bg-emerald-100 border-emerald-500',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-600',
    hover: 'hover:bg-amber-100',
    selected: 'bg-amber-100 border-amber-500',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-100',
    selected: 'bg-purple-100 border-purple-500',
  },
};

export const CONDITION_MAP = {
  gt: 'Maior que',
  lt: 'Menor que',
  gte: 'Maior ou igual a',
  lte: 'Menor ou igual a',
};
