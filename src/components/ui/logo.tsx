
import React from 'react';
import logoImage from '@/assets/logo-betelhub.png';

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
          src={logoImage}
          alt="BetelHub Logo" 
          className="bg-white rounded-full p-2 flex items-center justify-center"
        />
      </div>
      
      
    </div>
  );
};

export default Logo;
