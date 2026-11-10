import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PackagePlus,
  Compass,
  FileText,
  Shield,
  Bell,
  Users,
  CheckSquare,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();
  const { unreadCount } = useNotification();

  const studentLinks = [
    { name: 'Dashboard Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Report Item', path: '/report', icon: PackagePlus },
    { name: 'Browse Campus Items', path: '/browse', icon: Compass },
    { name: 'My Reports', path: '/my-reports', icon: FileText },
    { name: 'My Claims', path: '/my-claims', icon: Shield },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  const adminLinks = [
    { name: 'Admin Overview', path: '/admin', icon: BarChart3 },
    { name: 'Manage Claims', path: '/admin/claims', icon: CheckSquare },
    { name: 'Manage Items', path: '/admin/items', icon: FileText },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Report Item', path: '/report', icon: PackagePlus },
    { name: 'Browse Items', path: '/browse', icon: Compass },
    {
      name: 'Notifications',
      path: '/notifications',
      icon: Bell,
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 hidden md:flex">
      <div>
        {/* User Card */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-6 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-800 truncate">
              {user?.name}
            </h4>
            <span className="inline-block text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full mt-0.5">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase text-slate-400 px-3 mb-2 tracking-wider">
            {isAdmin ? 'Admin Management' : 'Student Portal'}
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/admin' || link.path === '/dashboard'}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </div>
                {link.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* University Hotline Box */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs">
        <p className="font-semibold text-slate-800 mb-1">Campus Security</p>
        <p className="text-slate-500 text-[11px] mb-2">
          Drop off or retrieve verified items at Ground Floor, Admin Block.
        </p>
        <span className="text-blue-600 font-bold text-[11px] block">
          Call: +91 (Campus Ext) 4421
        </span>
      </div>
    </aside>
  );
};

export default Sidebar;

