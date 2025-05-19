
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
          src="/lovable-uploads/5b587a7e-6cfb-401a-9bf4-17e540f0f7bf.png" 
          alt="AltarHub Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      
      {withText && (
        <div className="font-bold">
          <span className="text-church-red">Altar</span>
          <span className="text-church-blue">Hub</span>
        </div>
      )}
    </div>
  );
};

export default Logo;
