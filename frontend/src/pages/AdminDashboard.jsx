import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import {
  FileText,
  Clock,
  Activity,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Building,
  Cpu,
  Layers,
  ChevronRight,
  MapPin,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const STATUS_COLORS = {
  'Submitted': '#94a3b8',
  'Under Review': '#f59e0b',
  'In Progress': '#3b82f6',
  'Resolved': '#10b981',
};

const CATEGORY_COLORS = ['#3b82f6', '#06b6d4', '#6366f1', '#f59e0b', '#10b981', '#8b5cf6'];

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
    } finally {
      setLoading(false);
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
        return <span className="text-rose-700 bg-rose-50 border border-rose-200 font-bold px-2 py-0.5 rounded text-[11px]">Critical</span>;
      case 'High':
        return <span className="text-orange-700 bg-orange-50 border border-orange-200 font-semibold px-2 py-0.5 rounded text-[11px]">High</span>;
      case 'Medium':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 font-semibold px-2 py-0.5 rounded text-[11px]">Medium</span>;
      default:
        return <span className="text-slate-600 bg-slate-100 font-medium px-2 py-0.5 rounded text-[11px]">Low</span>;
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        Loading Admin Operations Command Center...
      </div>
    );
  }

  const { stats, charts, recentComplaints } = dashboardData || {
    stats: { total: 0, pending: 0, inProgress: 0, resolved: 0, critical: 0 },
    charts: { byCategory: [], byStatus: [], byDepartment: [] },
    recentComplaints: [],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-navy-700">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Cpu className="w-3.5 h-3.5" />
            Central Command & Analytics
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Administrative Operations Dashboard
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Monitor campus-wide tickets, triage workload by department, and track AI priority metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/complaints"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" />
            Manage Complaints
          </Link>
          <Link
            to="/admin/ai-intelligence"
            className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-slate-700 text-cyan-300 font-semibold text-xs transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            AI Intelligence
          </Link>
        </div>
      </div>

      {/* 5 Cards as specified in Section 6.A */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Total */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-900">{stats.total}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">All campus tickets</p>
          </div>
        </div>

        {/* Card 2: Pending */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-amber-600">{stats.pending}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Needs review</p>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">In Progress</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-blue-600">{stats.inProgress}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Maintenance active</p>
          </div>
        </div>

        {/* Card 4: Resolved */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Resolved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-emerald-600">{stats.resolved}</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Closed tickets</p>
          </div>
        </div>

        {/* Card 5: Critical Complaints */}
        <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs hover:border-rose-400 transition-colors bg-gradient-to-br from-white to-rose-50/30">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Critical</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-rose-600">{stats.critical}</span>
            <p className="text-[11px] text-rose-600/80 font-medium mt-0.5">Immediate danger/hazard</p>
          </div>
        </div>

      </div>

      {/* Charts Section (Section 6.A Requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart 1: Complaints by Category */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Complaints by Category</h3>
            <p className="text-xs text-slate-400">Distribution across campus service sectors</p>
          </div>
          <div className="h-64 w-full">
            {charts.byCategory?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.byCategory} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No data</div>
            )}
          </div>
        </div>

        {/* Chart 2: Complaints by Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Complaints by Status</h3>
            <p className="text-xs text-slate-400">Resolution pipeline breakdown</p>
          </div>
          <div className="h-64 w-full">
            {charts.byStatus?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.byStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={45}
                    paddingAngle={3}
                  >
                    {charts.byStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || '#6366f1'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No data</div>
            )}
          </div>
        </div>

        {/* Chart 3: Department-wise Complaints */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Department Workload</h3>
            <p className="text-xs text-slate-400">Total vs Pending by department</p>
          </div>
          <div className="h-64 w-full">
            {charts.byDepartment?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.byDepartment} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} interval={0} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="total" name="Total Assigned" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pending" name="Still Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No data</div>
            )}
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Campus Complaints</h2>
            <p className="text-xs text-slate-500">Live stream of incoming student issues</p>
          </div>
          <Link
            to="/admin/complaints"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            Manage All Tickets
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                <th className="py-3 px-6">Ticket ID</th>
                <th className="py-3 px-4">Title & Location</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentComplaints.map((c) => (
                <tr
                  key={c._id}
                  onClick={() => setSelectedComplaint(c)}
                  className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-6 font-mono font-bold text-blue-700 whitespace-nowrap">
                    {c.ticketId}
                  </td>
                  <td className="py-3.5 px-4 max-w-xs">
                    <p className="font-bold text-slate-900 truncate group-hover:text-blue-600">
                      {c.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {c.location}
                    </p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-slate-700 font-medium">
                    {c.userName}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium">
                      {c.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getPriorityBadge(c.priority)}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getStatusBadge(c.status)}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="text-blue-600 font-semibold group-hover:underline inline-flex items-center gap-0.5">
                      Review
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default AdminDashboard;
