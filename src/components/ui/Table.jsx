import React from 'react';

const Table = ({ 
  children, 
  className = '',
  variant = 'default',
  ...props 
}) => {
  const variantClasses = {
    default: 'liquid-glass-card overflow-hidden',
    simple: 'bg-white rounded-lg border border-neutral-200 overflow-hidden',
    minimal: 'w-full'
  };

  const classes = [
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {children}
        </table>
      </div>
    </div>
  );
};

const TableHeader = ({ 
  children, 
  className = '',
  variant = 'default',
  ...props 
}) => {
  const variantClasses = {
    default: 'bg-gradient-to-r from-neutral-800 to-neutral-700',
    light: 'bg-neutral-50 border-b border-neutral-200',
    glass: 'bg-white bg-opacity-50 backdrop-blur-sm'
  };

  const classes = [
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <thead className={classes} {...props}>
      {children}
    </thead>
  );
};

const TableRow = ({ 
  children, 
  className = '',
  hover = true,
  ...props 
}) => {
  const hoverClasses = hover ? 'hover:bg-white hover:bg-opacity-60 transition-colors' : '';
  
  const classes = [
    hoverClasses,
    className
  ].filter(Boolean).join(' ');

  return (
    <tr className={classes} {...props}>
      {children}
    </tr>
  );
};

const TableHead = ({ 
  children, 
  className = '',
  sortable = false,
  sorted,
  onSort,
  ...props 
}) => {
  const baseClasses = 'px-6 py-4 text-left text-sm font-semibold text-white';
  const sortableClasses = sortable ? 'cursor-pointer hover:bg-white hover:bg-opacity-10 select-none' : '';
  
  const classes = [
    baseClasses,
    sortableClasses,
    className
  ].filter(Boolean).join(' ');

  const SortIcon = () => {
    if (!sortable) return null;
    
    if (sorted === 'asc') {
      return <span className="ml-1">↑</span>;
    } else if (sorted === 'desc') {
      return <span className="ml-1">↓</span>;
    }
    return <span className="ml-1 opacity-50">↕</span>;
  };

  const handleClick = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  return (
    <th className={classes} onClick={handleClick} {...props}>
      <div className="flex items-center">
        {children}
        <SortIcon />
      </div>
    </th>
  );
};

const TableCell = ({ 
  children, 
  className = '',
  variant = 'default',
  ...props 
}) => {
  const variantClasses = {
    default: 'px-6 py-4 text-sm text-neutral-900',
    number: 'px-6 py-4 text-sm text-neutral-900 text-right font-mono',
    badge: 'px-6 py-4 text-sm',
    action: 'px-6 py-4 text-sm text-right'
  };

  const classes = [
    variantClasses[variant],
    className
  ].filter(Boolean).join(' ');

  return (
    <td className={classes} {...props}>
      {children}
    </td>
  );
};

const TableBody = ({ children, className = '', ...props }) => {
  const classes = [
    'bg-white bg-opacity-50 divide-y divide-neutral-200',
    className
  ].filter(Boolean).join(' ');

  return (
    <tbody className={classes} {...props}>
      {children}
    </tbody>
  );
};

const TableFooter = ({ children, className = '', ...props }) => {
  const classes = [
    'px-6 py-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// 添加分頁組件
const Pagination = ({ 
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = ''
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.slice(
    Math.max(0, currentPage - 3),
    Math.min(totalPages, currentPage + 2)
  );

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        上一頁
      </button>
      
      {visiblePages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            page === currentPage
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm bg-neutral-200 text-neutral-700 rounded hover:bg-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        下一頁
      </button>
    </div>
  );
};

// 導出所有組件
Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Footer = TableFooter;
Table.Pagination = Pagination;

export default Table;