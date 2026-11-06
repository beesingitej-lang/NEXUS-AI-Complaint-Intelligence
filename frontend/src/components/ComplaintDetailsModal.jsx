import React from 'react';
import {
  X,
  Clock,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Building,
  User,
  Activity,
  Layers,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const ComplaintDetailsModal = ({ complaint, onClose }) => {
  if (!complaint) return null;

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

  const getPriorityBadge = (priority, score) => {
    switch (priority) {
      case 'Critical':
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Critical ({score || 90}/100)</span>;
      case 'High':
        return <span className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5" /> High ({score || 70}/100)</span>;
      case 'Medium':
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Medium ({score || 50}/100)</span>;
      default:
        return <span className="bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">Low ({score || 25}/100)</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-navy-900 px-6 py-4 text-white flex items-center justify-between border-b border-navy-800">
          <div className="flex items-center gap-3">
            <span className="font-mono bg-blue-600/40 text-cyan-300 border border-cyan-400/30 text-xs px-2.5 py-1 rounded-md font-bold">
              {complaint.ticketId || 'TICKET'}
            </span>
            <h2 className="text-lg font-bold text-white truncate max-w-md">
              {complaint.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top Badges & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge(complaint.status)}
              {getPriorityBadge(complaint.priority, complaint.priorityScore)}
              <span className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium">
                {complaint.category}
              </span>
            </div>
            <div className="text-xs text-slate-500">
              Submitted: {new Date(complaint.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1.5">Problem Description</h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-sm text-slate-800 leading-relaxed">
              {complaint.description}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <MapPin className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Location / Block</p>
                <p className="text-sm font-semibold text-slate-800">{complaint.location}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <Building className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Responsible Department</p>
                <p className="text-sm font-semibold text-slate-800">{complaint.department || 'General Administration'}</p>
              </div>
            </div>
          </div>

          {/* AI Intelligence Card */}
          <div className="bg-gradient-to-br from-blue-50/60 to-cyan-50/40 rounded-xl border border-blue-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">NEXUS AI Intelligence Analysis</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-3">
              <div className="bg-white p-2.5 rounded-lg border border-blue-100/80 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Category</span>
                <p className="text-xs font-bold text-blue-700 truncate">{complaint.category}</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100/80 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Sentiment</span>
                <p className="text-xs font-bold text-slate-800 truncate">{complaint.sentiment || 'Negative'}</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100/80 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Severity</span>
                <p className="text-xs font-bold text-orange-600 truncate">{complaint.severity || 'Medium'}</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-blue-100/80 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Target SLA</span>
                <p className="text-xs font-bold text-emerald-700 truncate">{complaint.slaHours || 48} Hours</p>
              </div>
            </div>

            {complaint.aiAnalysis?.summary && (
              <p className="text-xs text-slate-700 bg-white/80 p-2.5 rounded-lg border border-blue-100 italic">
                "{complaint.aiAnalysis.summary}"
              </p>
            )}
          </div>

          {/* Duplicate Detection Alert if present */}
          {complaint.similarComplaints && complaint.similarComplaints.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Similar Complaint Detected
              </div>
              <div className="space-y-2">
                {complaint.similarComplaints.map((sim, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-white/80 p-2.5 rounded-lg border border-amber-100">
                    <div>
                      <span className="font-mono font-bold text-slate-800">{sim.complaintId}</span> - {sim.title}
                    </div>
                    <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
                      {sim.similarityScore}% match
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin Remarks */}
          {complaint.adminRemarks && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <h4 className="text-xs uppercase font-bold text-slate-500 tracking-wider mb-1">Administrative Remarks</h4>
              <p className="text-xs text-slate-800 font-medium">{complaint.adminRemarks}</p>
            </div>
          )}

          {/* Timeline */}
          {complaint.statusHistory && complaint.statusHistory.length > 0 && (
            <div>
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-3">Resolution Timeline</h4>
              <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                {complaint.statusHistory.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-3 pl-7">
                    <div className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs w-full shadow-2xs">
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>{step.status}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {new Date(step.timestamp).toLocaleDateString()} {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{step.remarks}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default ComplaintDetailsModal;
