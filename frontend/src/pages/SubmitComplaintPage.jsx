import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  Sparkles,
  Send,
  AlertTriangle,
  CheckCircle2,
  Building,
  MapPin,
  Clock,
  Cpu,
  Layers,
  ArrowRight,
  ShieldAlert,
  Activity,
  RotateCcw
} from 'lucide-react';

const PRESET_EXAMPLES = [
  {
    title: 'Water is leaking in Block C for three days',
    desc: 'Main overhead pipe is leaking water continuously in Block C corridor near room 204 for three days.',
    loc: 'Block C, 2nd Floor',
    dept: '',
  },
  {
    title: 'Short circuit and sparking in Lab 302',
    desc: 'Dangerous spark coming from power switchboard. Smoke smell and risk of electrical fire.',
    loc: 'Science Block, Lab 302',
    dept: 'Electrical Maintenance',
  },
  {
    title: 'WiFi connection dropping constantly in Library',
    desc: 'Unable to connect to campus wifi on 2nd floor library study hall.',
    loc: 'Central Library, 2nd Floor',
    dept: '',
  },
  {
    title: 'Trash bins overflowing near cafeteria',
    desc: 'Garbage has not been collected for two days, creating bad smell and insects near eating area.',
    loc: 'Cafeteria Courtyard',
    dept: '',
  },
];

const SubmitComplaintPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    department: '',
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // If user changes text after analysis, prompt re-analysis
    if (aiAnalysis) {
      setAiAnalysis(null);
    }
  };

  const loadPreset = (preset) => {
    setFormData({
      title: preset.title,
      description: preset.desc,
      location: preset.loc,
      department: preset.dept,
    });
    setAiAnalysis(null);
    setError('');
  };

  // Step 1: Send complaint to AI service for real-time analysis
  const handlePreAnalyze = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      setError('Please fill in Title, Problem Description, and Location / Block.');
      return;
    }

    setAnalyzing(true);
    try {
      const res = await api.post('/complaints/pre-analyze', formData);
      if (res.data.success) {
        setAiAnalysis(res.data.analysis);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'AI analysis temporarily unavailable. You can still submit directly.');
    } finally {
      setAnalyzing(false);
    }
  };

  // Step 2: Save complaint into MongoDB after confirmation
  const handleConfirmSubmit = async () => {
    setError('');
    setSubmitting(true);

    try {
      const res = await api.post('/complaints', {
        ...formData,
        confirmedAnalysis: aiAnalysis,
      });

      if (res.data.success) {
        setSubmittedSuccess(res.data.complaint);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'High':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      case 'Medium':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      default:
        return 'bg-slate-100 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          Complaint Registration
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
          Submit a Complaint
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Provide details about the issue. NEXUS AI will automatically categorize, estimate severity, and route it to the right department.
        </p>
      </div>

      {/* Quick Test Demo Presets */}
      <div className="bg-slate-100/80 rounded-2xl p-4 border border-slate-200">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Quick Test Examples (Click to fill form):
        </p>
        <div className="flex flex-wrap gap-2">
          {PRESET_EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => loadPreset(ex)}
              className="text-xs bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 font-medium transition-colors"
            >
              "{ex.title}"
            </button>
          ))}
        </div>
      </div>

      {/* Main Submission Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        <form onSubmit={handlePreAnalyze} className="p-6 sm:p-8 space-y-6">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Complaint Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Water is leaking in Block C for three days"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Describe Your Problem <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide specific details about what is happening, for how long, and any damage or inconvenience caused..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 resize-y"
            />
          </div>

          {/* Location and Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Location / Block <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Block C, 2nd Floor Room 204"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department (Optional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
                >
                  <option value="">Let AI identify automatically</option>
                  <option value="Water & Plumbing Dept">Water & Plumbing Dept</option>
                  <option value="Electrical Maintenance">Electrical Maintenance</option>
                  <option value="IT & Network Operations">IT & Network Operations</option>
                  <option value="Campus Maintenance & Civil Works">Campus Maintenance & Civil Works</option>
                  <option value="Sanitation & Housekeeping">Sanitation & Housekeeping</option>
                  <option value="General Administration">General Administration</option>
                </select>
              </div>
            </div>
          </div>

          {/* Large Submit Button */}
          {!aiAnalysis && (
            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-bold text-base shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              {analyzing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  NEXUS AI is analyzing your complaint...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-cyan-300" />
                  Analyze Complaint with NEXUS AI
                </>
              )}
            </button>
          )}

        </form>

        {/* AI Analysis Result Card (Section 5.B Requirement) */}
        {aiAnalysis && (
          <div className="border-t border-blue-200 bg-gradient-to-b from-blue-50/70 to-slate-50 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    NEXUS AI Intelligence Analysis
                  </h3>
                  <p className="text-xs text-slate-500">
                    NLP Categorization & Priority Calculation Results
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAiAnalysis(null)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Re-analyze
              </button>
            </div>

            {/* AI Results Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              
              {/* Category */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500">Predicted Category</span>
                <p className="text-sm font-bold text-blue-700 mt-1">{aiAnalysis.category}</p>
                <span className="text-[10px] text-slate-400">
                  {Math.round((aiAnalysis.category_confidence || 0.85) * 100)}% confidence
                </span>
              </div>

              {/* Department */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500">Responsible Dept</span>
                <p className="text-sm font-bold text-slate-900 mt-1 truncate" title={aiAnalysis.department}>
                  {aiAnalysis.department}
                </p>
                <span className="text-[10px] text-slate-400">Auto-routed</span>
              </div>

              {/* Severity & Sentiment */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-slate-500">Severity & Sentiment</span>
                <p className="text-sm font-bold text-orange-600 mt-1">{aiAnalysis.severity}</p>
                <span className="text-[10px] text-slate-500 capitalize">{aiAnalysis.sentiment}</span>
              </div>

              {/* Priority */}
              <div className={`p-3.5 rounded-xl border shadow-2xs ${getPriorityColor(aiAnalysis.priority)}`}>
                <span className="text-[10px] uppercase font-bold opacity-80">Calculated Priority</span>
                <p className="text-sm font-black mt-1">
                  {aiAnalysis.priority} ({aiAnalysis.priority_score}/100)
                </p>
                <span className="text-[10px] font-medium opacity-80">
                  SLA: {aiAnalysis.sla_resolution_hours} Hours
                </span>
              </div>

            </div>

            {/* AI Summary note */}
            {aiAnalysis.ai_summary && (
              <div className="bg-white rounded-xl p-3.5 border border-blue-200/80 text-xs text-slate-700 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{aiAnalysis.ai_summary}</p>
              </div>
            )}

            {/* Duplicate Detection Alert if similar complaints exist */}
            {aiAnalysis.has_similar && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Similar Complaint Detected! ({aiAnalysis.similar_complaints_count} related issue found)
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Our system noticed an existing issue with similar symptoms in this location. Submitting will link your report to increase urgency!
                </p>
                {aiAnalysis.similar_complaints?.map((sc, i) => (
                  <div key={i} className="bg-white/80 rounded-lg p-2.5 text-xs border border-amber-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      {sc.complaint_id} - {sc.title}
                    </span>
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px]">
                      {sc.similarity_score}% match
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Confirmation & Save Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                Verify the AI analysis above. Click confirm to log your complaint.
              </p>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-400 text-white font-bold text-sm shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-4 h-4" />
                {submitting ? 'Saving Complaint...' : 'Confirm & Submit Complaint'}
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Success Modal */}
      {submittedSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 text-center space-y-4 border border-slate-200">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              Complaint Successfully Submitted!
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Ticket ID:</span>
                <span className="font-mono font-bold text-blue-700">{submittedSuccess.ticketId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="font-semibold">{submittedSuccess.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Priority:</span>
                <span className="font-bold text-orange-600">{submittedSuccess.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-semibold">{submittedSuccess.department}</span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Your issue has been forwarded to campus maintenance with real-time status tracking.
            </p>

            <button
              onClick={() => navigate('/my-complaints')}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-2"
            >
              View in My Complaints
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default SubmitComplaintPage;
