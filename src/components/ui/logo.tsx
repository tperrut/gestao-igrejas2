
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  withText = false,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <img   
          src="https://gecwfcexufkvdkndbjip.supabase.co/storage/v1/object/sign/lp-altar-hub/logoAltarHub.PNG?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85YjczNjdiYi0yMWRjLTQxM2QtYWMzNy0zNjQzMTFjNGFhMGUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJscC1hbHRhci1odWIvbG9nb0FsdGFySHViLlBORyIsImlhdCI6MTc1MTM0MTYwNCwiZXhwIjoxNzgyODc3NjA0fQ.u8HKuXlomOG0DIF7mDR4qqKDD0wApnjAfceOWf98bKE" 
          alt="AltarHub Logo" 
          className="bg-white rounded-full p-2 flex items-center justify-center"
        />
      </div>
      
      
    </div>
  );
};

export default Logo;
