import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ComplaintDetailsModal from '../components/ComplaintDetailsModal';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  ArrowRight,
  Sparkles,
  MapPin,
  ChevronRight,
  ShieldAlert,
  Activity
} from 'lucide-react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/complaints/stats/user');
      if (res.data.success) {
        setStats(res.data.stats);
        setRecentComplaints(res.data.recentComplaints || []);
      }
    } catch (err) {
      console.error('Failed to load user stats:', err);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-navy-700">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-300 bg-blue-500/20 px-2.5 py-1 rounded-md border border-cyan-400/30">
            Student / User Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Track your submitted campus issues and monitor AI resolution stages in real-time.
          </p>
        </div>

        <Link
          to="/submit-complaint"
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Submit New Complaint
        </Link>
      </div>

      {/* 4 Dashboard Cards as requested in Section 5.A */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Complaints</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-slate-900">{stats.total}</span>
            <p className="text-xs text-slate-400 mt-1">Lifetime logged complaints</p>
          </div>
        </div>

        {/* Card 2: Pending */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Complaints</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-amber-600">{stats.pending}</span>
            <p className="text-xs text-slate-400 mt-1">Awaiting review or triage</p>
          </div>
        </div>

        {/* Card 3: In Progress */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-blue-600">{stats.inProgress}</span>
            <p className="text-xs text-slate-400 mt-1">Active repair in field</p>
          </div>
        </div>

        {/* Card 4: Resolved */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved Complaints</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-black text-emerald-600">{stats.resolved}</span>
            <p className="text-xs text-slate-400 mt-1">Successfully solved</p>
          </div>
        </div>

      </div>

      {/* Recent Complaints Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Complaints</h2>
            <p className="text-xs text-slate-500">Your latest logged issues and their current resolution status</p>
          </div>
          <Link
            to="/my-complaints"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View All ({stats.total})
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Loading recent complaints...
          </div>
        ) : recentComplaints.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No complaints submitted yet</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Whenever you face any issue in campus blocks or hostels, click below to report it.
            </p>
            <Link
              to="/submit-complaint"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg mt-2 shadow-xs hover:bg-blue-500"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Your First Complaint
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentComplaints.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedComplaint(item)}
                className="p-4 sm:px-6 hover:bg-slate-50/80 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {item.ticketId}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {item.category}
                    </span>
                    {getPriorityBadge(item.priority)}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {item.location}
                    </span>
                    <span>•</span>
                    <span>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                  {getStatusBadge(item.status)}
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complaint Detail Modal */}
      {selectedComplaint && (
        <ComplaintDetailsModal
          complaint={selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
        />
      )}

    </div>
  );
};

export default UserDashboard;
