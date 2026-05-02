import React, { useState, useRef, useEffect } from 'react';

const Dropdown = ({ 
  trigger, 
  children,
  align = 'right',
  width = 'w-56',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div 
          className={`absolute z-50 mt-2 ${width} ${align === 'right' ? 'right-0' : 'left-0'} 
            origin-top-${align} rounded-2xl border border-slate-700/60 bg-[#0B0F19]/95 backdrop-blur-xl 
            shadow-[0_0_30px_rgba(79,124,255,0.08)] light:bg-white light:border-slate-200 light:shadow-xl
            transition-all duration-300 ease-in-out ${className}`}
        >
          <div className="py-2 px-1" role="menu" aria-orientation="vertical">
            {/* Clone children to pass close function if needed */}
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { 
                  onClick: (e) => {
                    if (child.props.onClick) child.props.onClick(e);
                    setIsOpen(false);
                  }
                });
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({ children, icon, onClick, className = '', danger = false }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2.5 text-sm rounded-xl flex items-center gap-3 transition-all duration-200
        ${danger 
          ? 'text-rose-400 hover:bg-rose-500/10 light:text-rose-600 light:hover:bg-rose-50' 
          : 'text-slate-300 hover:bg-slate-800 hover:text-white light:text-slate-700 light:hover:bg-slate-100 light:hover:text-slate-900'} 
        ${className}`}
      role="menuitem"
    >
      {icon && <span className="opacity-70">{icon}</span>}
      {children}
    </button>
  );
};

export default Dropdown;
