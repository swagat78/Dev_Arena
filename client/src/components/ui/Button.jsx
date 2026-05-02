import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md hover:shadow-lg focus:ring-blue-500",
    secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700 light:bg-slate-100 light:text-slate-900 light:hover:bg-slate-200 shadow-sm",
    outline: "border-2 border-slate-700 hover:border-blue-500 text-slate-300 hover:text-white light:border-slate-300 light:text-slate-700 light:hover:border-blue-500 bg-transparent",
    ghost: "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white light:hover:bg-slate-100 light:text-slate-600",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-md focus:ring-rose-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-lg",
    md: "px-5 py-2.5 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-2xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
