// frontend/src/components/AlertCard.tsx
import { TrendingUp, Clock, Trash2, Bell } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onDelete: (id: number) => void;
  isHistory?: boolean;
}

export function AlertCard({ alert, onDelete, isHistory }: AlertCardProps) {
  // Ver implementação no artefato
}