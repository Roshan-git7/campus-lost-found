import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';
import api from '../services/api';
import ItemCard from '../components/items/ItemCard';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const CATEGORIES = [
  'All',
  'Electronics',
  'Documents / ID Cards',
  'Wallets',
  'Keys',
  'Bags',
  'Books',
  'Clothing',
  'Accessories',
  'Other',
];

const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter state initialized from URL search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [type, setType] = useState(searchParams.get('type') || 'All');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || '');
  const [status, setStatus] = useState(searchParams.get('status') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));

  // Sync state when URL params change
  useEffect(() => {
    if (searchParams.get('search') !== null) setSearch(searchParams.get('search') || '');
    if (searchParams.get('category') !== null) setCategory(searchParams.get('category') || 'All');
    if (searchParams.get('type') !== null) setType(searchParams.get('type') || 'All');
  }, [searchParams]);

  // Fetch items whenever filters change
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: 12,
          sort,
        };

        if (search.trim()) params.search = search.trim();
        if (category && category !== 'All') params.category = category;
        if (type && type !== 'All') params.type = type;
        if (status && status !== 'All') params.status = status;
        if (locationFilter.trim()) params.location = locationFilter.trim();

        const res = await api.get('/items', { params });
        if (res.data.success) {
          setItems(res.data.data);
          setTotal(res.data.total);
          setTotalPages(res.data.totalPages);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [search, category, type, locationFilter, status, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setType('All');
    setLocationFilter('');
    setStatus('All');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Campus Item Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Browse, search, and identify reported lost & found belongings
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span>Total Records:</span>
          <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-full">
            {total} items
          </span>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        {/* Search Input Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by keywords, title, or description..."
              className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="md:col-span-3">
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => {
                setLocationFilter(e.target.value);
                setPage(1);
              }}
              placeholder="Filter location (e.g. Library, Lab 3)"
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="md:col-span-3 flex items-center space-x-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full text-xs px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="date_desc">Incident Date: Recent</option>
              <option value="date_asc">Incident Date: Oldest</option>
            </select>

            <button
              onClick={handleResetFilters}
              title="Reset Filters"
              className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Categories and Status Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          {/* Type Filter Buttons */}
          <div className="flex items-center space-x-1 mr-3 bg-slate-100 p-1 rounded-lg">
            {['All', 'Lost', 'Found'].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition ${
                  type === t
                    ? t === 'Lost'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : t === 'Found'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t === 'All' ? 'All Types' : t}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
          >
            <option value="All">All Categories</option>
            {CATEGORIES.filter((c) => c !== 'All').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Claim Pending">Claim Pending</option>
            <option value="Claimed">Claimed</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      </div>

      {/* Item Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FolderOpen}
          title="No Items Found"
          description="We couldn't find any items matching your active search filters."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Showing Page <span className="font-semibold">{page}</span> of{' '}
            <span className="font-semibold">{totalPages}</span>
          </p>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 transition flex items-center space-x-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const p = idx + 1;
              if (
                p === 1 ||
                p === totalPages ||
                (p >= page - 1 && p <= page + 1)
              ) {
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition ${
                      page === p
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                );
              }
              return null;
            })}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 transition flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowsePage;

