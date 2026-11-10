import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  AlertCircle,
  X,
  User,
  Package,
} from 'lucide-react';
import api from '../services/api';
import EmptyState from '../components/common/EmptyState';

const AdminClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);
  const [error, setError] = useState('');

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await api.get('/admin/claims', { params });
      if (res.data.success) {
        setClaims(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching admin claims:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [statusFilter]);

  const handleReview = async (decision) => {
    if (!selectedClaim) return;
    setReviewing(true);
    setError('');

    try {
      const res = await api.put(`/admin/claims/${selectedClaim._id}/review`, {
        status: decision,
        adminNotes,
      });

      if (res.data.success) {
        setClaims((prev) =>
          prev.map((c) => (c._id === selectedClaim._id ? res.data.data : c))
        );
        setSelectedClaim(null);
        setAdminNotes('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to review claim');
    } finally {
      setReviewing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Ownership Claim Moderation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-verify ownership evidence submitted by campus claimants
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs self-start sm:self-auto">
          {['All', 'Pending', 'Approved', 'Rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-md font-semibold transition ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading claims...</div>
      ) : claims.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Target Item</th>
                  <th className="px-5 py-3.5">Claimant</th>
                  <th className="px-5 py-3.5">Date Submitted</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {claims.map((claim) => (
                  <tr key={claim._id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900">
                        {claim.itemId?.title || 'Unknown Item'}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {claim.itemId?.category} • {claim.itemId?.location}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">
                        {claim.claimantId?.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        UID: {claim.claimantId?.uid || 'N/A'} • {claim.claimantId?.email}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          claim.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {claim.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setSelectedClaim(claim)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg text-xs transition"
                      >
                        {claim.status === 'Pending' ? 'Review & Verify' : 'View Evidence'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Shield}
          title="No Claims Found"
          description={`No ${statusFilter.toLowerCase()} claims found in database.`}
        />
      )}

      {/* Review Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <button
              onClick={() => setSelectedClaim(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold uppercase text-blue-600 tracking-wider">
                Claim Verification Panel
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedClaim.itemId?.title}
              </h3>
            </div>

            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs">
                {error}
              </div>
            )}

            {/* Claimant Info */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1">
              <div className="font-semibold text-slate-800 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                <span>Claimant: {selectedClaim.claimantId?.name}</span>
              </div>
              <p className="text-slate-500">
                Email: {selectedClaim.claimantId?.email} | UID: {selectedClaim.claimantId?.uid || 'Not recorded'}
              </p>
            </div>

            {/* Evidence Proof Text */}
            <div>
              <span className="block text-xs font-semibold text-slate-700 mb-1">
                Proof of Ownership Submitted:
              </span>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed max-h-36 overflow-y-auto">
                {selectedClaim.proofOfOwnership}
              </div>
            </div>

            {selectedClaim.supportingImage && (
              <div>
                <span className="block text-xs font-semibold text-slate-700 mb-1">
                  Supporting Photo / Receipt:
                </span>
                <img
                  src={selectedClaim.supportingImage}
                  alt="Claim Evidence"
                  className="w-full h-40 object-cover rounded-xl border border-slate-200"
                />
              </div>
            )}

            {/* Admin Notes Field */}
            {selectedClaim.status === 'Pending' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrative Decision Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Serial number matches or Verified with student ID"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            ) : (
              selectedClaim.adminNotes && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                  <span className="font-bold block">Decision Notes:</span>
                  <p>{selectedClaim.adminNotes}</p>
                </div>
              )
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedClaim(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>

              {selectedClaim.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleReview('Rejected')}
                    disabled={reviewing}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    Reject Claim
                  </button>
                  <button
                    onClick={() => handleReview('Approved')}
                    disabled={reviewing}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    Approve Claim & Notify
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClaimsPage;

