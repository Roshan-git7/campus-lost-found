import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PackagePlus,
  Compass,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  MapPin,
  CheckCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/items/ItemCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalReturned: 0,
    recoveryRate: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        // Fetch recent items
        const res = await api.get('/items?limit=6&sort=newest');
        if (res.data.success) {
          setRecentItems(res.data.data);
        }

        // Fetch basic stats
        const statsRes = await api.get('/items?limit=1');
        if (statsRes.data.success) {
          setStats((prev) => ({
            ...prev,
            totalItems: statsRes.data.total || 0,
          }));
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="bg-navy-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-navy-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#1e40af_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/30 text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI-Assisted Campus Belonging Recovery System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Lost Something on Campus? <br className="hidden sm:inline" />
            <span className="text-blue-400">Let’s Help You Recover It.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            The university’s centralized portal for reporting, searching, and
            verifying lost & found belongings. From student IDs and laptops to
            keys and earphones.
          </p>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center bg-white rounded-xl p-1.5 shadow-2xl border border-slate-200"
          >
            <div className="pl-3 text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, item name, brand, or location..."
              className="flex-1 px-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs sm:text-sm font-semibold transition flex items-center space-x-1.5 shadow-sm"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Popular Categories Shortcut */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300">Quick Filters:</span>
            {['Electronics', 'Documents / ID Cards', 'Wallets', 'Keys', 'Bags'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => navigate(`/browse?category=${encodeURIComponent(cat)}`)}
                  className="px-2.5 py-1 rounded-md bg-navy-800/80 hover:bg-navy-700 text-slate-300 hover:text-white border border-navy-700 transition text-[11px]"
                >
                  {cat}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Action 1: Report Lost */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <PackagePlus className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              I Lost An Item
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Submit details and photos of your missing item. We'll automatically
              cross-match reports and notify you when found.
            </p>
            <Link
              to="/report?type=Lost"
              className="inline-flex items-center text-xs font-semibold text-rose-600 hover:text-rose-700 space-x-1"
            >
              <span>File Lost Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Action 2: Report Found */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              I Found Someone's Belonging
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Help a fellow student or faculty member. Upload item details so
              the verified owner can identify and claim it.
            </p>
            <Link
              to="/report?type=Found"
              className="inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700 space-x-1"
            >
              <span>File Found Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Action 3: Browse All */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Browse Campus Directory
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Search by classroom, library, canteen, or campus sports arena with
              dynamic category & date filters.
            </p>
            <Link
              to="/browse"
              className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 space-x-1"
            >
              <span>Explore All Items</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Workflow */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            How The Recovery Workflow Works
          </h2>
          <p className="text-xs text-slate-500">
            A transparent four-step process ensuring items are securely returned
            to their rightful owners without privacy risks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Report Details',
              desc: 'Submit item details, date, campus location, and description securely.',
            },
            {
              step: '02',
              title: 'Smart Matching',
              desc: 'Our scoring engine compares category, keywords, date, and location.',
            },
            {
              step: '03',
              title: 'Verify Ownership',
              desc: 'Submit private proof (e.g. serial number, lock pattern, or receipt).',
            },
            {
              step: '04',
              title: 'Secure Handover',
              desc: 'Collect item at Campus Security Office upon administrative approval.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-xl border border-slate-200 relative group"
            >
              <span className="text-3xl font-black text-slate-200 group-hover:text-blue-200 transition-colors block mb-2">
                {item.step}
              </span>
              <h4 className="font-bold text-sm text-slate-900 mb-1.5">
                {item.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Reported Items */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recently Reported Belongings
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Latest items reported across university grounds
            </p>
          </div>
          <Link
            to="/browse"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : recentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 border border-slate-200 text-center text-slate-500 text-xs">
            No items reported yet. Be the first to report a lost or found item.
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;

