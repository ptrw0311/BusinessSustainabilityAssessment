import React from 'react';

const Select = ({ 
  children, 
  className = '',
  label,
  error,
  ...props 
}) => {
  const baseClasses = 'custom-select w-full';
  
  const classes = [
    baseClasses,
    error ? 'border-error-500 focus:border-error-500 focus:ring-error-200' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <select className={classes} {...props}>
        {children}
      </select>
      {error && (
        <p className="text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

const Option = ({ children, ...props }) => {
  return (
    <option {...props}>
      {children}
    </option>
  );
};

Select.Option = Option;

export default Select;