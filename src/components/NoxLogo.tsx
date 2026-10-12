import React from 'react';

interface NoxLogoProps {
  className?: string;
}

export const NoxLogo: React.FC<NoxLogoProps> = ({ className = 'h-8' }) => {
  return (
    <div className="flex items-center justify-center">
      <img 
        src="/nox-logo.png" 
        alt="NOX" 
        className={`${className} object-contain`} 
      />
    </div>
  );
};