import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  Shield,
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import api from '../services/api';
import { StatsSkeleton } from '../components/common/LoadingSkeleton';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <StatsSkeleton />
      </div>
    );
  }

  const stats = data?.stats || {
    totalUsers: 0,
    totalLost: 0,
    totalFound: 0,
    totalPendingClaims: 0,
    totalReturned: 0,
    recoveryRate: 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-0.5">
            Administration Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Campus Operations & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            University-wide overview of reported belongings, claims, and recovery rates
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to="/admin/claims"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Review Pending Claims ({stats.totalPendingClaims})</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Registered Users</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            {stats.totalUsers}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Students & Staff</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Lost Items</span>
            <Package className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">
            {stats.totalLost}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Missing reports</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Found Items</span>
            <Package className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
            {stats.totalFound}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Submitted to desk</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Pending Claims</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {stats.totalPendingClaims}
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">Awaiting review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold text-slate-600">Recovery Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-blue-600">
            {stats.recoveryRate}%
          </span>
          <span className="text-[11px] text-slate-400 block mt-1">
            {stats.totalReturned} items returned
          </span>
        </div>
      </div>

      {/* Two Column Layout: Category Analytics & Recent Claims */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Category Analytics Breakdown */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Category Distribution
            </h3>
            <span className="text-xs text-slate-400">Total volume</span>
          </div>

          <div className="space-y-3">
            {data?.categoryStats && data.categoryStats.length > 0 ? (
              data.categoryStats.map((cat) => (
                <div key={cat._id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">{cat._id}</span>
                    <span className="font-bold text-slate-900">
                      {cat.count} total ({cat.lostCount} lost, {cat.foundCount} found)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-rose-500 h-full"
                      style={{
                        width: `${(cat.lostCount / (cat.count || 1)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-emerald-500 h-full"
                      style={{
                        width: `${(cat.foundCount / (cat.count || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                No items categorized yet.
              </p>
            )}
          </div>
        </div>

        {/* Right: Recent Claims Awaiting Review */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm">
              Recent Ownership Claims
            </h3>
            <Link
              to="/admin/claims"
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              View All Claims
            </Link>
          </div>

          <div className="space-y-3">
            {data?.recentClaims && data.recentClaims.length > 0 ? (
              data.recentClaims.map((claim) => (
                <div
                  key={claim._id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="overflow-hidden pr-3">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        claim.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : claim.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {claim.status}
                    </span>
                    <h4 className="font-bold text-xs text-slate-900 truncate mt-1">
                      {claim.itemId?.title || 'Campus Item'}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Claimed by {claim.claimantId?.name} ({claim.claimantId?.uid || 'Student'})
                    </p>
                  </div>

                  <Link
                    to="/admin/claims"
                    className="p-1.5 text-slate-400 hover:text-blue-600 transition"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-6 text-center">
                No recent claims submitted.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

