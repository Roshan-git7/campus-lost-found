import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PackagePlus,
  Compass,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ItemCard from '../components/items/ItemCard';
import { CardSkeleton, StatsSkeleton } from '../components/common/LoadingSkeleton';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReported: 0,
    totalLost: 0,
    totalFound: 0,
    pendingClaims: 0,
  });
  const [myReports, setMyReports] = useState([]);
  const [myClaims, setMyClaims] = useState([]);
  const [recentCampusFound, setRecentCampusFound] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [reportsRes, claimsRes, campusFoundRes] = await Promise.all([
          api.get('/items/my-reports'),
          api.get('/claims/my-claims'),
          api.get('/items?type=Found&limit=3&sort=newest'),
        ]);

        const reports = reportsRes.data.data || [];
        const claims = claimsRes.data.data || [];
        const found = campusFoundRes.data.data || [];

        setMyReports(reports);
        setMyClaims(claims);
        setRecentCampusFound(found);

        const lostCount = reports.filter((r) => r.type === 'Lost').length;
        const foundCount = reports.filter((r) => r.type === 'Found').length;
        const pendingClaimsCount = claims.filter((c) => c.status === 'Pending').length;

        setStats({
          totalReported: reports.length,
          totalLost: lostCount,
          totalFound: foundCount,
          pendingClaims: pendingClaimsCount,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
            Student Recovery Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user?.name || 'Student'}! 👋
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Track your lost belongings, view active ownership claims, and check
            status updates from campus security.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/report?type=Lost"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
          >
            <PackagePlus className="w-3.5 h-3.5" />
            <span>Report Lost</span>
          </Link>
          <Link
            to="/report?type=Found"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Report Found</span>
          </Link>
        </div>
      </div>

      {/* Real Statistics Metric Cards */}
      {loading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-xs font-semibold block mb-1">
              My Total Reports
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats.totalReported}
              </span>
              <span className="text-[11px] text-slate-400">items</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-xs font-semibold block mb-1">
              Items Lost by Me
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">
                {stats.totalLost}
              </span>
              <span className="text-[11px] text-slate-400">cases</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-xs font-semibold block mb-1">
              Items Found by Me
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {stats.totalFound}
              </span>
              <span className="text-[11px] text-slate-400">reported</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-slate-500 text-xs font-semibold block mb-1">
              Pending Claims
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                {stats.pendingClaims}
              </span>
              <span className="text-[11px] text-slate-400">in review</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Report Lost Item', path: '/report?type=Lost', icon: PackagePlus, color: 'text-rose-600' },
          { label: 'Report Found Item', path: '/report?type=Found', icon: Shield, color: 'text-emerald-600' },
          { label: 'Browse Directory', path: '/browse', icon: Compass, color: 'text-blue-600' },
          { label: 'My Reports', path: '/my-reports', icon: FileText, color: 'text-purple-600' },
          { label: 'My Claims', path: '/my-claims', icon: CheckCircle, color: 'text-amber-600' },
        ].map((action, i) => {
          const Icon = action.icon;
          return (
            <Link
              key={i}
              to={action.path}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-400 hover:shadow transition flex flex-col items-center text-center group"
            >
              <Icon className={`w-5 h-5 ${action.color} mb-2 group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600">
                {action.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Reports & Recent Claims */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: My Recent Reports */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              My Recent Submissions
            </h3>
            <Link
              to="/my-reports"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All ({myReports.length})
            </Link>
          </div>

          {myReports.length > 0 ? (
            <div className="space-y-3">
              {myReports.slice(0, 4).map((report) => (
                <div
                  key={report._id}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between transition"
                >
                  <div className="overflow-hidden pr-3">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        report.type === 'Lost'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {report.type}
                    </span>
                    <h4 className="font-semibold text-xs text-slate-800 truncate mt-1">
                      {report.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {report.location} • {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    to={`/items/${report._id}`}
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              You haven't reported any lost or found items yet.
            </div>
          )}
        </div>

        {/* Right: Recently Found Across Campus */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Recently Found Across Campus
            </h3>
            <Link
              to="/browse?type=Found"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Browse Found
            </Link>
          </div>

          {recentCampusFound.length > 0 ? (
            <div className="space-y-3">
              {recentCampusFound.map((item) => (
                <div
                  key={item._id}
                  className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 flex items-center justify-between transition"
                >
                  <div className="overflow-hidden pr-3">
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <h4 className="font-semibold text-xs text-slate-800 truncate mt-1">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Found at: {item.location}
                    </p>
                  </div>
                  <Link
                    to={`/items/${item._id}`}
                    className="text-xs font-medium text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <span>Check</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No found items reported recently.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

