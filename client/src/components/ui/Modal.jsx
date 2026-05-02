import React, { useEffect } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  maxWidth = 'max-w-md',
  hideCloseButton = false
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
      {/* Overlay click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* Modal Content */}
      <div 
        className={`relative w-full ${maxWidth} rounded-2xl border border-slate-700/60 bg-[#0B0F19]/95 shadow-[0_0_40px_rgba(79,124,255,0.15)] 
          backdrop-blur-xl overflow-hidden light:bg-white light:border-slate-200 light:shadow-2xl animate-in fade-in zoom-in-95 duration-300`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle top gradient accent */}
        <div className="h-1 w-full bg-gradient-to-r from-blue-600 to-purple-600" />
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-800/50 light:border-slate-100">
          <h3 className="text-xl font-bold text-white light:text-slate-900">{title}</h3>
          
          {!hideCloseButton && (
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-xl transition-all duration-200 light:hover:bg-slate-100 light:hover:text-slate-900"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Body */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
