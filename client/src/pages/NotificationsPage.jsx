import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Sparkles, Shield, Package, ArrowRight } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import EmptyState from '../components/common/EmptyState';

const NotificationsPage = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useNotification();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'match_found':
        return <Sparkles className="w-5 h-5 text-blue-500" />;
      case 'claim_approved':
        return <Shield className="w-5 h-5 text-emerald-500" />;
      case 'claim_rejected':
        return <Shield className="w-5 h-5 text-rose-500" />;
      case 'item_returned':
        return <Package className="w-5 h-5 text-indigo-500" />;
      default:
        return <Bell className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stay updated with claims, smart matches, and report status changes
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 self-start sm:self-auto shadow-sm"
          >
            <CheckCheck className="w-4 h-4 text-blue-600" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading notifications...</div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => !n.isRead && markAsRead(n._id)}
              className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 cursor-pointer ${
                n.isRead
                  ? 'bg-white border-slate-200 opacity-80'
                  : 'bg-blue-50/50 border-blue-200 shadow-sm'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-xs flex-shrink-0">
                  {getNotificationIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {n.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(n.createdAt).toLocaleDateString()} at{' '}
                    {new Date(n.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {n.relatedItem && (
                <Link
                  to={`/items/${n.relatedItem._id || n.relatedItem}`}
                  className="p-1.5 text-blue-600 hover:text-blue-700 hover:bg-white rounded-lg transition flex-shrink-0"
                  title="View Item"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No Notifications"
          description="You're all caught up! New claim updates and smart matches will appear here."
        />
      )}
    </div>
  );
};

export default NotificationsPage;

