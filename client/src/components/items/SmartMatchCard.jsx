import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { TypeBadge } from '../common/Badge';

const SmartMatchCard = ({ matchData }) => {
  const { item, score, breakdown } = matchData;

  const getScoreColor = (pts) => {
    if (pts >= 75) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (pts >= 50) return 'text-blue-700 bg-blue-50 border-blue-200';
    return 'text-amber-700 bg-amber-50 border-amber-200';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <TypeBadge type={item.type} />
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            {item.category}
          </span>
        </div>

        {/* Similarity Score Pill */}
        <div
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(
            score
          )}`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{score}% Match</span>
        </div>
      </div>

      <h4 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-1">
        {item.title}
      </h4>
      <p className="text-xs text-slate-500 line-clamp-2 mb-3">
        {item.description}
      </p>

      {/* Match Explainability Breakdown */}
      <div className="bg-slate-50 rounded-lg p-2.5 mb-3 border border-slate-100">
        <div className="text-[11px] font-medium text-slate-500 mb-1.5 flex items-center">
          <CheckCircle2 className="w-3 h-3 mr-1 text-blue-600" />
          <span>Similarity Breakdown:</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
          <div className="flex justify-between">
            <span>Category:</span>
            <span className="font-semibold text-slate-800">{breakdown.categoryScore}/30 pts</span>
          </div>
          <div className="flex justify-between">
            <span>Keywords:</span>
            <span className="font-semibold text-slate-800">{breakdown.keywordScore}/30 pts</span>
          </div>
          <div className="flex justify-between">
            <span>Location:</span>
            <span className="font-semibold text-slate-800">{breakdown.locationScore}/20 pts</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span className="font-semibold text-slate-800">{breakdown.dateScore}/20 pts</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span className="truncate max-w-[180px] flex items-center">
          <MapPin className="w-3 h-3 mr-1 text-slate-400" />
          {item.location}
        </span>
        <Link
          to={`/items/${item._id}`}
          className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center space-x-1"
        >
          <span>Inspect</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
};

export default SmartMatchCard;

