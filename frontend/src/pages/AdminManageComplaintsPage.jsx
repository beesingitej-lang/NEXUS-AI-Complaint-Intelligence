import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Activity,
  ShieldAlert,
  AlertTriangle,
  Building,
  Sparkles,
  ChevronRight,
  Edit3,
  X,
  Save,
  Check
} from 'lucide-react';

const DEPARTMENTS = [
  'Water & Plumbing Dept',
  'Electrical Maintenance',
  'IT & Network Operations',
  'Campus Maintenance & Civil Works',
  'Sanitation & Housekeeping',
  'General Administration',
];

const AdminManageComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Edit State
  const [editingComplaint, setEditingComplaint] = useState(null);
  const [editFormData, setEditFormData] = useState({
    status: '',
    department: '',
    priority: '',
    adminRemarks: '',
  });
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, priorityFilter, categoryFilter]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/complaints', {
        params: {
          status: statusFilter,
          priority: priorityFilter,
          category: categoryFilter,
          search: searchQuery,
        },
      });
      if (res.data.success) {
        setComplaints(res.data.complaints || []);
      }
    } catch (err) {
      console.error('Error fetching admin complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints();
  };

  const startEdit = (complaint, e) => {
    e.stopPropagation();
    setEditingComplaint(complaint);
    setEditFormData({
      status: complaint.status,
      department: complaint.department || 'General Administration',
      priority: complaint.priority,
      adminRemarks: complaint.adminRemarks || '',
    });
    setUpdateSuccess('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingComplaint) return;

    setUpdating(true);
    try {
      const res = await api.put(`/admin/complaints/${editingComplaint._id}`, editFormData);
      if (res.data.success) {
        setComplaints(prev =>
          prev.map(c => (c._id === editingComplaint._id ? res.data.complaint : c))
        );
        setUpdateSuccess('Complaint updated successfully! User notified.');
        setTimeout(() => {
          setEditingComplaint(null);
          setUpdateSuccess('');
        }, 1200);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyDuplicate = async (complaintId, targetTicketId, e) => {
    e.stopPropagation();
    try {
      const res = await api.post(`/admin/complaints/${complaintId}/verify-duplicate`, {
        targetComplaintId: targetTicketId,
        isDuplicate: true,
      });
      if (res.data.success) {
        setComplaints(prev =>
          prev.map(c => (c._id === complaintId ? res.data.complaint : c))
        );
      }
    } catch (err) {
      console.error('Verify error:', err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
      case 'In Progress':
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> In Progress</span>;
      case 'Under Review':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1"><Activity className="w-3 h-3" /> Under Review</span>;
      default:
        return <span className="bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Submitted</span>;
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Manage Complaints
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review complaints, assign departments, update statuses, and verify AI duplicates
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Status filter tabs */}
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
          <form onSubmit={handleSearch} className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticket, title, user..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
            />
          </form>

        </div>

        {/* Category & Priority Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Quick Filters:
          </span>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium"
          >
            <option value="All">All Categories</option>
            <option value="Water Supply">Water Supply</option>
            <option value="Electricity">Electricity</option>
            <option value="Network">Network</option>
            <option value="Infrastructure">Infrastructure</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Other">Other</option>
          </select>
        </div>

      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            Loading complaints registry...
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No complaints found</p>
            <p className="text-xs text-slate-400">Try clearing filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="py-3.5 px-4 sm:px-6">Ticket</th>
                  <th className="py-3.5 px-4">Title & Location</th>
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Category & Dept</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">AI Duplicates</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((c) => (
                  <tr
                    key={c._id}
                    onClick={() => setSelectedComplaint(c)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 sm:px-6 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {c.ticketId}
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-bold text-slate-900 group-hover:text-blue-600 truncate">
                        {c.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {c.location}
                      </p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-800">{c.userName}</p>
                      <p className="text-[10px] text-slate-400">{c.userEmail}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800 block truncate">
                        {c.category}
                      </span>
                      <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">
                        {c.department || 'Unassigned'}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getPriorityBadge(c.priority)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {c.similarComplaints && c.similarComplaints.length > 0 ? (
                        <div className="flex items-center gap-1.5">
                          <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            {c.similarComplaints.length} Similar
                          </span>
                          {!c.similarComplaints[0].isVerifiedDuplicate && (
                            <button
                              onClick={(e) => handleVerifyDuplicate(c._id, c.similarComplaints[0].complaintId, e)}
                              className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium"
                              title="Verify duplicate match"
                            >
                              Verify
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">None</span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(c.status)}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => startEdit(c, e)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3 h-3" />
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Edit Complaint Modal */}
      {editingComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            
            <div className="bg-navy-900 px-6 py-4 text-white flex items-center justify-between border-b border-navy-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold bg-blue-600/40 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded">
                  {editingComplaint.ticketId}
                </span>
                <h3 className="text-sm font-bold truncate max-w-xs">
                  Update Complaint Status & Assignment
                </h3>
              </div>
              <button
                onClick={() => setEditingComplaint(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              
              {updateSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  {updateSuccess}
                </div>
              )}

              <div>
                <p className="font-bold text-slate-800 text-sm">{editingComplaint.title}</p>
                <p className="text-slate-500 mt-0.5">{editingComplaint.location} • Submitted by {editingComplaint.userName}</p>
              </div>

              {/* Status */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Complaint Status
                </label>
                <select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                >
                  <option value="Submitted">Submitted (Waiting Review)</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress (Maintenance Dispatched)</option>
                  <option value="Resolved">Resolved (Completed)</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assign Department
                </label>
                <select
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Priority override */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Priority Level
                </label>
                <select
                  value={editFormData.priority}
                  onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                >
                  <option value="Low">Low (0-30)</option>
                  <option value="Medium">Medium (31-50)</option>
                  <option value="High">High (51-75)</option>
                  <option value="Critical">Critical (76-100)</option>
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Admin Remarks (Visible to Student)
                </label>
                <textarea
                  rows={3}
                  value={editFormData.adminRemarks}
                  onChange={(e) => setEditFormData({ ...editFormData, adminRemarks: e.target.value })}
                  placeholder="e.g. Electrician scheduled for 2 PM. Replacement parts ordered."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingComplaint(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30"
                >
                  <Save className="w-4 h-4" />
                  {updating ? 'Saving...' : 'Save & Notify User'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedComplaint && !editingComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}

    </div>
  );
};

export default AdminManageComplaintsPage;
