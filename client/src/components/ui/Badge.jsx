import React from 'react';

const Badge = ({ 
  children, 
  variant = 'default',
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-300";
  
  const variants = {
    default: "bg-slate-800 text-slate-300 border border-slate-700 light:bg-slate-100 light:text-slate-700 light:border-slate-200",
    primary: "bg-blue-500/10 text-blue-400 border border-blue-500/20 light:bg-blue-50 light:text-blue-700",
    success: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 light:bg-emerald-50 light:text-emerald-700",
    warning: "bg-amber-500/10 text-amber-400 border border-amber-500/20 light:bg-amber-50 light:text-amber-700",
    error: "bg-rose-500/10 text-rose-400 border border-rose-500/20 light:bg-rose-50 light:text-rose-700",
    gradient: "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-purple-300 border border-purple-500/30"
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};

export default Badge;
