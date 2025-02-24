import { ShieldCheckIcon, ShieldAlertIcon, AlertTriangleIcon } from 'lucide-react';

interface SecurityIndicatorProps {
  status: 'safe' | 'warning' | 'danger';
  message: string;
}

export function SecurityIndicator({ status, message }: SecurityIndicatorProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'safe':
        return {
          icon: ShieldCheckIcon,
          color: 'text-green-600 dark:text-green-500',
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
        };
      case 'warning':
        return {
          icon: AlertTriangleIcon,
          color: 'text-yellow-600 dark:text-yellow-500',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
        };
      case 'danger':
        return {
          icon: ShieldAlertIcon,
          color: 'text-red-600 dark:text-red-500',
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${config.bg} ${config.border}`}>
      <Icon className={`h-5 w-5 ${config.color}`} />
      <span className={`text-sm font-medium ${config.color}`}>{message}</span>
    </div>
  );
}