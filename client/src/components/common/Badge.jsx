import React from 'react';

export const TypeBadge = ({ type }) => {
  const isLost = type === 'Lost';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
        isLost
          ? 'bg-rose-100 text-rose-800 border border-rose-200'
          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
          isLost ? 'bg-rose-500' : 'bg-emerald-500'
        }`}
      />
      {type}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  const config = {
    Open: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
    },
    'Claim Pending': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
    },
    Claimed: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      dot: 'bg-purple-500',
    },
    Returned: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
    },
    Closed: {
      bg: 'bg-slate-100 text-slate-600 border-slate-200',
      dot: 'bg-slate-400',
    },
  };

  const current = config[status] || config.Open;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${current.bg}`}
    >
      <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${current.dot}`} />
      {status}
    </span>
  );
};

export const CategoryBadge = ({ category }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
      {category}
    </span>
  );
};

