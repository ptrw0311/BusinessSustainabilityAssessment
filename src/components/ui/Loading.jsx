import React from 'react';

const Loading = ({ 
  type = 'spinner',
  size = 'md',
  text = '',
  className = ''
}) => {
  const sizeClasses = {
    sm: type === 'spinner' ? 'w-4 h-4' : 'gap-1',
    md: type === 'spinner' ? 'w-6 h-6' : 'gap-1.5', 
    lg: type === 'spinner' ? 'w-8 h-8' : 'gap-2',
    xl: type === 'spinner' ? 'w-12 h-12' : 'gap-3'
  };

  const dotSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4', 
    xl: 'w-6 h-6'
  };

  const Spinner = () => (
    <div 
      className={`loading-spinner ${sizeClasses[size]} ${className}`}
      style={{
        borderTopColor: 'var(--primary-500)'
      }}
    />
  );

  const Dots = () => (
    <div className={`loading-dots ${sizeClasses[size]} ${className}`}>
      <div className={`loading-dot ${dotSizes[size]}`} />
      <div className={`loading-dot ${dotSizes[size]}`} />
      <div className={`loading-dot ${dotSizes[size]}`} />
    </div>
  );

  const Pulse = () => (
    <div className={`animate-pulse ${className}`}>
      <div className={`bg-neutral-200 rounded ${sizeClasses[size]}`} />
    </div>
  );

  const renderLoading = () => {
    switch (type) {
      case 'dots':
        return <Dots />;
      case 'pulse':
        return <Pulse />;
      default:
        return <Spinner />;
    }
  };

  if (text) {
    return (
      <div className={`flex items-center justify-center space-x-3 ${className}`}>
        {renderLoading()}
        <span className="text-sm text-neutral-600 font-medium">{text}</span>
      </div>
    );
  }

  return renderLoading();
};

// 全屏加載組件
const FullPageLoading = ({ text = '載入中...', className = '' }) => {
  return (
    <div className={`fixed inset-0 z-modal bg-white bg-opacity-80 backdrop-blur-sm flex items-center justify-center ${className}`}>
      <div className="text-center">
        <Loading type="spinner" size="xl" />
        <p className="mt-4 text-lg font-medium text-neutral-700">{text}</p>
      </div>
    </div>
  );
};

// 卡片加載組件  
const CardLoading = ({ className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="space-y-4">
        <div className="h-4 bg-neutral-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-neutral-200 rounded" />
          <div className="h-3 bg-neutral-200 rounded w-5/6" />
        </div>
        <div className="h-8 bg-neutral-200 rounded w-1/2" />
      </div>
    </div>
  );
};

// 表格行加載組件
const TableRowLoading = ({ columns = 4, className = '' }) => {
  return (
    <tr className={`animate-pulse ${className}`}>
      {Array.from({ length: columns }, (_, index) => (
        <td key={index} className="px-6 py-4">
          <div className="h-4 bg-neutral-200 rounded" />
        </td>
      ))}
    </tr>
  );
};

Loading.FullPage = FullPageLoading;
Loading.Card = CardLoading;
Loading.TableRow = TableRowLoading;

export default Loading;