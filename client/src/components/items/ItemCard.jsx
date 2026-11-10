import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { TypeBadge, StatusBadge, CategoryBadge } from '../common/Badge';

const ItemCard = ({ item }) => {
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col group">
      {/* Image Container */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={`w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 ${
            item.imageUrl ? 'hidden' : 'flex'
          }`}
        >
          <ImageIcon className="w-10 h-10 mb-1 opacity-50" />
          <span className="text-xs font-medium">No photo provided</span>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <TypeBadge type={item.type} />
        </div>
        <div className="absolute top-3 right-3">
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-2">
            <CategoryBadge category={item.category} />
          </div>

          <h3 className="font-semibold text-slate-900 text-base leading-snug line-clamp-1 mb-1.5 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h3>

          <p className="text-slate-600 text-xs line-clamp-2 mb-4 leading-relaxed">
            {item.description}
          </p>
        </div>

        <div>
          {/* Metadata */}
          <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-500 mb-4">
            <div className="flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-slate-400 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Action Button */}
          <Link
            to={`/items/${item._id}`}
            className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200 hover:border-blue-200 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;

