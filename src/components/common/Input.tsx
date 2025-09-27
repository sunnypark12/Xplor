import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseInputClasses = 'block w-full px-3 py-2 glass-card placeholder-gray-500 placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all duration-200 sm:text-sm text-glass';
  
  const stateClasses = error 
    ? 'ring-red-400 ring-2 text-red-700' 
    : 'focus:ring-primary-400 focus:ring-2';
    
  const iconClasses = icon 
    ? iconPosition === 'left' ? 'pl-10' : 'pr-10'
    : '';
    
  const widthClass = fullWidth ? 'w-full' : '';
  
  const inputClasses = `${baseInputClasses} ${stateClasses} ${iconClasses} ${className}`;

  return (
    <div className={`${widthClass}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <span className={`text-gray-400 ${error ? 'text-red-400' : ''}`}>
              {icon}
            </span>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
