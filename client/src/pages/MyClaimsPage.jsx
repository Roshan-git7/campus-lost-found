import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Clock, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';
import EmptyState from '../components/common/EmptyState';

const MyClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyClaims = async () => {
    try {
      setLoading(true);
      const res = await api.get('/claims/my-claims');
      if (res.data.success) {
        setClaims(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching claims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClaims();
  }, []);

  const handleCancelClaim = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this ownership claim?')) return;
    try {
      const res = await api.put(`/claims/${id}/cancel`);
      if (res.data.success) {
        setClaims((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: 'Cancelled' } : c))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel claim');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
            Rejected
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          My Ownership Claims
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track verification status of items you claimed as your belonging
        </p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading claims...</div>
      ) : claims.length > 0 ? (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim._id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-3">
                  {getStatusBadge(claim.status)}
                  <span className="text-xs text-slate-400">
                    Claimed on {new Date(claim.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {claim.status === 'Pending' && (
                  <button
                    onClick={() => handleCancelClaim(claim._id)}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold self-start sm:self-auto"
                  >
                    Cancel Claim
                  </button>
                )}
              </div>

              {/* Item Info Summary */}
              {claim.itemId ? (
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Target Item
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">
                      {claim.itemId.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {claim.itemId.category} • Location: {claim.itemId.location}
                    </p>
                  </div>

                  <Link
                    to={`/items/${claim.itemId._id}`}
                    className="text-xs font-semibold text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <span>View Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Associated item has been archived or removed.</p>
              )}

              {/* Proof Submitted */}
              <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 space-y-1 border border-slate-100">
                <span className="font-semibold text-slate-800 block text-[11px] uppercase tracking-wider">
                  Submitted Proof
                </span>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {claim.proofOfOwnership}
                </p>
                {claim.additionalDescription && (
                  <p className="text-slate-500 text-xs italic mt-1">
                    Note: {claim.additionalDescription}
                  </p>
                )}
              </div>

              {/* Administrative Feedback */}
              {claim.adminNotes && (
                <div
                  className={`p-3 rounded-xl text-xs border ${
                    claim.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  <span className="font-bold block mb-0.5">Admin Review Feedback:</span>
                  <p>{claim.adminNotes}</p>
                </div>
              )}

              {/* Next Steps for Approved Claim */}
              {claim.status === 'Approved' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-800">
                  <span className="font-bold block mb-1">📍 Item Handover Instructions:</span>
                  Please visit the Campus Security Office (Admin Block Ground Floor) during operational hours (9 AM - 5 PM). Bring your student identity card to collect your belonging.
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Shield}
          title="No Active Claims"
          description="You haven't submitted any ownership claims for found belongings."
          actionLabel="Browse Found Items"
          actionLink="/browse?type=Found"
        />
      )}
    </div>
  );
};

export default MyClaimsPage;

