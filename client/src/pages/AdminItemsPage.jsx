import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Trash2, Edit, CheckCircle, Search, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { TypeBadge, StatusBadge, CategoryBadge } from '../components/common/Badge';

const AdminItemsPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = { page, limit: 15 };
      if (search) params.search = search;
      if (typeFilter !== 'All') params.type = typeFilter;

      const res = await api.get('/items', { params });
      if (res.data.success) {
        setItems(res.data.data);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching admin items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [search, typeFilter, page]);

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      const res = await api.put(`/admin/items/${itemId}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        setItems((prev) =>
          prev.map((item) =>
            item._id === itemId ? { ...item, status: newStatus } : item
          )
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item report?')) return;
    try {
      const res = await api.delete(`/items/${itemId}`);
      if (res.data.success) {
        setItems((prev) => prev.filter((item) => item._id !== itemId));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete item');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Campus Item Inventory Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Moderate, update statuses, or record physical handovers
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
          >
            <option value="All">All Types</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400">Loading items...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Item</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Reported By</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Status Update</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/60 transition">
                    <td className="px-5 py-4">
                      <div className="flex items-center space-x-3">
                        <TypeBadge type={item.type} />
                        <span className="font-bold text-slate-900">{item.title}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <CategoryBadge category={item.category} />
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {item.reportedBy?.name || 'Campus Member'}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {item.location}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item._id, e.target.value)}
                        className="text-xs px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-700"
                      >
                        <option value="Open">Open</option>
                        <option value="Claim Pending">Claim Pending</option>
                        <option value="Claimed">Claimed</option>
                        <option value="Returned">Returned</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    <td className="px-5 py-4 text-right space-x-2">
                      <Link
                        to={`/items/${item._id}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="text-rose-600 hover:text-rose-700 p-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminItemsPage;

