import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, PlusCircle, Sparkles, Edit, Trash2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { TypeBadge, StatusBadge, CategoryBadge } from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';

const MyReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  const fetchMyReports = async () => {
    try {
      setLoading(true);
      const res = await api.get('/items/my-reports');
      if (res.data.success) {
        setReports(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  useEffect(() => {
    if (activeTab === 'All') {
      setFilteredReports(reports);
    } else {
      setFilteredReports(reports.filter((r) => r.type === activeTab));
    }
  }, [activeTab, reports]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      const res = await api.delete(`/items/${id}`);
      if (res.data.success) {
        setReports((prev) => prev.filter((r) => r._id !== id));
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            My Reported Items
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your submitted lost and found reports
          </p>
        </div>

        <Link
          to="/report"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Report</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 text-xs">
        {['All', 'Lost', 'Found'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 px-3 font-semibold transition border-b-2 ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab} Reports (
            {tab === 'All'
              ? reports.length
              : reports.filter((r) => r.type === tab).length}
            )
          </button>
        ))}
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading your reports...</div>
      ) : filteredReports.length > 0 ? (
        <div className="space-y-3">
          {filteredReports.map((report) => (
            <div
              key={report._id}
              className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition"
            >
              <div className="flex items-start space-x-4">
                {report.imageUrl ? (
                  <img
                    src={report.imageUrl}
                    alt={report.title}
                    className="w-16 h-16 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <FileText className="w-6 h-6 opacity-40" />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <TypeBadge type={report.type} />
                    <CategoryBadge category={report.category} />
                    <StatusBadge status={report.status} />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900">{report.title}</h3>
                  <p className="text-xs text-slate-500">
                    {report.location} • {new Date(report.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2 self-end sm:self-center">
                <Link
                  to={`/items/${report._id}`}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                >
                  View
                </Link>
                <Link
                  to={`/items/${report._id}/edit`}
                  className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(report._id)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No Reports Filed"
          description="You haven't submitted any lost or found reports yet."
          actionLabel="Report an Item"
          actionLink="/report"
        />
      )}
    </div>
  );
};

export default MyReportsPage;

