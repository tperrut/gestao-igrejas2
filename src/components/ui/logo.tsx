
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
          src="https://gecwfcexufkvdkndbjip.supabase.co/storage/v1/object/sign/lp-altar-hub/logo2_com_texto%20(1).png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InN0b3JhZ2UtdXJsLXNpZ25pbmcta2V5XzZiZmIxZTU3LTU0MTMtNGUyNi1iZTkwLTc2MDU5MDM4NTdmNyJ9.eyJ1cmwiOiJscC1hbHRhci1odWIvbG9nbzJfY29tX3RleHRvICgxKS5wbmciLCJpYXQiOjE3NDc2MTcwMjAsImV4cCI6MTc3OTE1MzAyMH0.4_kzLZN7hfa9Eudx8O3VOghGVJpfQcQp9tfA9HFmKYA" 
          alt="AltarHub Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      
    </div>
  );
};

export default Logo;
