import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Shield,
  Sparkles,
  User,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Edit,
  Trash2,
  Share2,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TypeBadge, StatusBadge, CategoryBadge } from '../components/common/Badge';
import ClaimModal from '../components/claims/ClaimModal';
import SmartMatchCard from '../components/items/SmartMatchCard';

const ItemDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchItemAndMatches = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/items/${id}`);
        if (res.data.success) {
          setItem(res.data.data);

          // Fetch smart matches
          setMatchLoading(true);
          try {
            const matchRes = await api.get(`/items/matches/${id}`);
            if (matchRes.data.success) {
              setMatches(matchRes.data.data.matches || []);
            }
          } catch (matchErr) {
            console.error('Error fetching smart matches:', matchErr);
          } finally {
            setMatchLoading(false);
          }
        }
      } catch (err) {
        console.error('Error fetching item details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItemAndMatches();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this report? This cannot be undone.')) {
      return;
    }

    try {
      const res = await api.delete(`/items/${id}`);
      if (res.data.success) {
        navigate('/browse');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report');
    }
  };

  const handleClaimSubmitted = (claimData) => {
    setActionMessage({
      type: 'success',
      text: 'Your claim was submitted successfully! Campus administration has been notified.',
    });
    setItem((prev) => ({ ...prev, status: 'Claim Pending' }));
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse space-y-6">
        <div className="h-6 bg-slate-200 rounded w-1/4"></div>
        <div className="h-80 bg-slate-200 rounded-xl"></div>
        <div className="h-8 bg-slate-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-800 mb-1">Item Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested item report does not exist or may have been removed.
        </p>
        <Link
          to="/browse"
          className="inline-flex items-center text-xs font-semibold px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to Browse
        </Link>
      </div>
    );
  }

  const isOwner = user && item.reportedBy && (user._id === item.reportedBy._id || user._id === item.reportedBy);
  const canModify = isOwner || isAdmin;
  const isAvailableForClaim =
    item.status === 'Open' || item.status === 'Claim Pending';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button & Action status */}
      <div className="flex items-center justify-between">
        <Link
          to="/browse"
          className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          <span>Back to directory</span>
        </Link>

        {canModify && (
          <div className="flex items-center space-x-2">
            <Link
              to={`/items/${item._id}/edit`}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Report</span>
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-medium rounded-lg flex items-center space-x-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {actionMessage.text && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        {/* Left Column: Image */}
        <div className="lg:col-span-5 space-y-4">
          <div className="w-full h-80 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center relative">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center text-slate-400 p-6">
                <Shield className="w-12 h-12 mx-auto mb-2 opacity-40" />
                <p className="text-xs">No image provided by reporter</p>
              </div>
            )}
            <div className="absolute top-3 left-3">
              <TypeBadge type={item.type} />
            </div>
          </div>

          {/* Privacy Note */}
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-500">
            <span className="font-semibold text-slate-700 block mb-0.5">
              🔒 Privacy Protection Policy
            </span>
            Personal phone numbers, raw student IDs, and private emails are
            never exposed publicly. Verification is handled securely through the
            portal and campus administration.
          </div>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <CategoryBadge category={item.category} />
                <StatusBadge status={item.status} />
              </div>
              <span className="text-xs text-slate-400">
                Reported {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {item.title}
            </h1>

            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-100 text-xs">
              <div className="flex items-center text-slate-600">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase font-semibold">
                    Location
                  </span>
                  <span className="font-medium text-slate-800">{item.location}</span>
                </div>
              </div>

              <div className="flex items-center text-slate-600">
                <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                <div>
                  <span className="block text-slate-400 text-[10px] uppercase font-semibold">
                    Date {item.type}
                  </span>
                  <span className="font-medium text-slate-800">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Description & Circumstances
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Reporter Info */}
            <div className="pt-2 flex items-center space-x-3 text-xs text-slate-500">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                {item.reportedBy?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <span className="font-semibold text-slate-800 block">
                  Reported by {item.reportedBy?.name || 'Campus Member'}
                </span>
                <span className="text-[10px] text-slate-400 capitalize">
                  {item.reportedBy?.role || 'Student'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button Section */}
          <div className="pt-6 border-t border-slate-100 space-y-3">
            {isAuthenticated ? (
              !isOwner ? (
                isAvailableForClaim ? (
                  <button
                    onClick={() => setClaimModalOpen(true)}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition flex items-center justify-center space-x-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>This Is My Item — Submit Claim</span>
                  </button>
                ) : (
                  <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-500 font-medium">
                    This item is currently marked as {item.status}. New claims
                    cannot be submitted at this stage.
                  </div>
                )
              ) : (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center text-xs text-blue-700 font-medium">
                  You are the author of this report. Monitor claims from your
                  Dashboard.
                </div>
              )
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center space-y-2">
                <p className="text-xs text-slate-600">
                  Are you the owner of this item? Sign in with your university
                  account to file a claim.
                </p>
                <Link
                  to="/login"
                  className="inline-block px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Log In to Claim
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Smart Item Matching Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                AI Smart Matching Engine
              </h2>
              <p className="text-xs text-slate-500">
                Comparing database records based on category, keywords, location,
                and date proximity.
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full">
            {matches.length} Potential {matches.length === 1 ? 'Match' : 'Matches'}
          </span>
        </div>

        {matchLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Scanning campus database for matching records...
          </div>
        ) : matches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <SmartMatchCard key={match.item._id} matchData={match} />
            ))}
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-xl text-center border border-slate-100">
            <p className="text-xs text-slate-500">
              No matching {item.type === 'Lost' ? 'found' : 'lost'} records
              detected yet. We will notify you automatically when a match appears.
            </p>
          </div>
        )}
      </div>

      {/* Claim Submission Modal */}
      <ClaimModal
        item={item}
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        onClaimSubmitted={handleClaimSubmitted}
      />
    </div>
  );
};

export default ItemDetailsPage;

