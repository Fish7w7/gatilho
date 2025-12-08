// frontend/src/hooks/useAlertNotifications.ts
import { useEffect, useState } from 'react';
import { AlertNotification } from '../types';

export function useAlertNotifications(userId: string) {
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${userId}`);
    
    ws.onmessage = (event) => {
      const data: AlertNotification = JSON.parse(event.data);
      setNotifications(prev => [data, ...prev]);
      
      // Notificação do navegador
      if (Notification.permission === 'granted') {
        new Notification('🔔 Alerta Disparado!', {
          body: `${data.ticker} ${data.condition} ${data.targetValue}`,
          icon: '/logo.png'
        });
      }
    };
    
    return () => ws.close();
  }, [userId]);
  
  return notifications;
}