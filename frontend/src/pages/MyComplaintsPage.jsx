import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  Clock,
  CheckCircle2,
  ChevronRight,
  Activity,
  AlertTriangle,
  MapPin,
  Calendar
} from 'lucide-react';

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints/my', {
        params: {
          status: statusFilter,
          search: searchQuery,
        },
      });
      if (res.data.success) {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Resolved</span>;
      case 'In Progress':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> In Progress</span>;
      case 'Under Review':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Under Review</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Submitted</span>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'Critical':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 font-bold px-2 py-0.5 rounded text-[11px]">Critical</span>;
      case 'High':
        return <span className="bg-orange-50 text-orange-700 border border-orange-200 font-semibold px-2 py-0.5 rounded text-[11px]">High</span>;
      case 'Medium':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 font-semibold px-2 py-0.5 rounded text-[11px]">Medium</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 font-medium px-2 py-0.5 rounded text-[11px]">Low</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            My Complaints
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track status, priority scoring, and department notes for your submitted issues
          </p>
        </div>

        <Link
          to="/submit-complaint"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Submit Complaint
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {['All', 'Submitted', 'Under Review', 'In Progress', 'Resolved'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === tab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, title, or block..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
          />
        </form>

      </div>

      {/* Complaints Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            Loading your complaints...
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No complaints found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {statusFilter !== 'All'
                ? `No complaints currently in '${statusFilter}' status.`
                : 'You have not submitted any complaints yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-3.5 px-4 sm:px-6">Complaint ID</th>
                  <th className="py-3.5 px-4">Title & Location</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {complaints.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => setSelectedComplaint(item)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {item.ticketId}
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        {item.location}
                      </p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getPriorityBadge(item.priority)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span className="text-blue-600 font-semibold group-hover:underline inline-flex items-center gap-1">
                        View
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modal */}
      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}

    </div>
  );
};

export default MyComplaintsPage;
