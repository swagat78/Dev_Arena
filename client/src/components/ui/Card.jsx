import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hoverable = false,
  ...props 
}) => {
  return (
    <div 
      className={`rounded-2xl border border-slate-800/60 bg-[#111827]/80 backdrop-blur-md p-6 shadow-sm transition-all duration-300 ease-in-out
        light:border-slate-200 light:bg-white light:shadow-md
        ${hoverable ? 'hover:shadow-[0_0_20px_rgba(79,124,255,0.1)] hover:border-slate-700 hover:-translate-y-1 light:hover:shadow-lg' : ''} 
        ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
