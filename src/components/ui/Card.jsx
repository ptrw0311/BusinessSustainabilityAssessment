import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = true,
  padding = 'default',
  ...props 
}) => {
  const baseClasses = 'transition-all duration-normal ease';
  
  const variantClasses = {
    default: 'liquid-glass-card',
    warm: 'warm-gradient-card', 
    glass: 'liquid-glass',
    solid: 'bg-white border border-neutral-200 shadow-md'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6', 
    lg: 'p-8',
    xl: 'p-12'
  };

  const hoverClasses = hover ? 'hover:shadow-xl hover:transform hover:-translate-y-1' : '';

  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    paddingClasses[padding],
    hoverClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div className={`mb-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = '', gradient = false, ...props }) => {
  const classes = gradient 
    ? `text-2xl font-bold text-gradient ${className}`
    : `text-2xl font-bold text-neutral-800 ${className}`;
  
  return (
    <h3 className={classes} {...props}>
      {children}
    </h3>
  );
};

const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div className={`mt-6 pt-4 border-t border-neutral-200 ${className}`} {...props}>
      {children}
    </div>
  );
};

// 導出所有組件
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;