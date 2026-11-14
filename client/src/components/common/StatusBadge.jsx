import React from 'react';

const statusStyles = {
  'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Review': 'bg-amber-50 text-amber-700 border-amber-200',
  'In Discussion': 'bg-purple-50 text-purple-700 border-purple-200',
  'Approved': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'In Progress': 'bg-orange-50 text-orange-700 border-orange-200',
  'Completed': 'bg-teal-50 text-teal-700 border-teal-200',
  'Rejected': 'bg-rose-50 text-rose-700 border-rose-200',
  'Cancelled': 'bg-slate-100 text-slate-600 border-slate-200',
  // Contact statuses
  'new': 'bg-orange-50 text-accent border-orange-200',
  'contacted': 'bg-amber-50 text-amber-700 border-amber-200',
  'converted': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'archived': 'bg-slate-100 text-slate-600 border-slate-200',
};

const StatusBadge = ({ status, size = 'sm' }) => {
  const currentStyle = statusStyles[status] || 'bg-slate-100 text-slate-700 border-slate-200';

  const sizeClasses = size === 'xs' 
    ? 'px-2 py-0.5 text-[10px]' 
    : size === 'lg'
    ? 'px-3.5 py-1 text-xs'
    : 'px-2.5 py-0.5 text-[11px]';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${currentStyle} ${sizeClasses}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;
