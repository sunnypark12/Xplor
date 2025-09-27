import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'glass-button text-glass font-semibold hover:text-primary-700 focus:ring-primary-500',
    secondary: 'glass-dark text-glass-dark font-semibold hover:bg-opacity-30 focus:ring-white',
    outline: 'border border-white border-opacity-40 text-glass bg-white bg-opacity-10 hover:bg-opacity-20 focus:ring-primary-500 backdrop-blur-sm',
    ghost: 'text-glass hover:bg-white hover:bg-opacity-20 focus:ring-primary-500',
    danger: 'glass-button text-red-700 font-semibold hover:bg-red-100 hover:bg-opacity-30 focus:ring-red-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  const isDisabled = disabled || loading;

  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" color={variant === 'outline' || variant === 'ghost' ? 'primary' : 'white'} />
          Loading...
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="flex-shrink-0">
              {icon}
            </span>
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <span className="flex-shrink-0">
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
