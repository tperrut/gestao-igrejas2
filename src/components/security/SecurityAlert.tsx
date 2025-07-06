
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface SecurityAlertProps {
  type: 'info' | 'warning' | 'error';
  title: string;
  description: string;
  className?: string;
}

const SecurityAlert: React.FC<SecurityAlertProps> = ({
  type,
  title,
  description,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'info':
        return <Shield className="h-4 w-4" />;
      case 'warning':
      case 'error':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getVariant = () => {
    switch (type) {
      case 'error':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Alert variant={getVariant()} className={className}>
      {getIcon()}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
};

export default SecurityAlert;
