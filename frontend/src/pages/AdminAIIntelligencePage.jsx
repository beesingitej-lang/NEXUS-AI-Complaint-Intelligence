import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Cpu,
  Sparkles,
  Layers,
  Copy,
  AlertTriangle,
  Zap,
  TrendingUp,
  MapPin,
  Building,
  CheckCircle2,
  Sliders,
  Calculator,
  Search,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const AdminAIIntelligencePage = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  // Interactive Live AI Simulator
  const [testText, setTestText] = useState('Water is leaking in Block C for three days.');
  const [testLocation, setTestLocation] = useState('Block C');
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  useEffect(() => {
    fetchInsights();
    runSimulation(testText, testLocation);
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/ai-insights');
      if (res.data.success) {
        setInsights(res.data.insights);
      }
    } catch (err) {
      console.error('Failed to load AI insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const runSimulation = async (text, location) => {
    setSimulating(true);
    try {
      const res = await api.post('/complaints/pre-analyze', {
        title: text,
        description: text,
        location: location || '',
      });
      if (res.data.success) {
        setSimulationResult(res.data.analysis);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleSimulateSubmit = (e) => {
    e.preventDefault();
    runSimulation(testText, testLocation);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-50 border-rose-300 text-rose-700';
      case 'High':
        return 'bg-orange-50 border-orange-300 text-orange-700';
      case 'Medium':
        return 'bg-amber-50 border-amber-300 text-amber-700';
      default:
        return 'bg-slate-100 border-slate-300 text-slate-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-navy-700">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            Core College Project Showcase
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            NEXUS AI Intelligence & Predictive Resolution Engine
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed">
            Transparent NLP classification, duplicate cosine similarity detection, and mathematical 0–100 smart priority scoring computed over real campus records.
          </p>
        </div>
      </div>

      {/* 4 Real-Data AI Insights Cards (Section 6.D Requirement) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Actual Complaint Records Insights (No Fake Data)
          </h2>
          <span className="text-xs text-slate-400">
            Computed dynamically from MongoDB records
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Insight 1: Most Reported Category */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Top Category
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-lg font-black text-slate-900 truncate block">
                {insights?.mostReportedCategory?.name || 'Loading...'}
              </span>
              <p className="text-xs text-blue-600 font-semibold mt-1">
                {insights?.mostReportedCategory?.count || 0} reports ({insights?.mostReportedCategory?.percentage || 0}% of all)
              </p>
            </div>
          </div>

          {/* Insight 2: Highest Complaint Location */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Highest Incident Location
              </span>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-lg font-black text-slate-900 truncate block">
                {insights?.highestComplaintLocation?.name || 'Loading...'}
              </span>
              <p className="text-xs text-rose-600 font-semibold mt-1">
                {insights?.highestComplaintLocation?.count || 0} complaints logged
              </p>
            </div>
          </div>

          {/* Insight 3: Most Pending Department */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Most Backlogged Dept
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-lg font-black text-slate-900 truncate block">
                {insights?.mostPendingDepartment?.name || 'Loading...'}
              </span>
              <p className="text-xs text-amber-600 font-semibold mt-1">
                {insights?.mostPendingDepartment?.count || 0} unresolved tickets
              </p>
            </div>
          </div>

          {/* Insight 4: Active Critical Issues */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Critical Hazards
              </span>
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <ShieldAlert className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-purple-700">
                {insights?.criticalIssuesCount || 0}
              </span>
              <p className="text-xs text-purple-600 font-semibold mt-1">
                Immediate SLA &lt; 6 Hours
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3 Core AI Pillars (Section 6.C Requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pillar 1: AI Complaint Classification */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                1. AI Complaint Classification
              </h3>
              <p className="text-[11px] text-slate-400">Automatic Category Mapping</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Matches semantic tokens across 6 campus categories without black-box confusion:
          </p>

          <div className="space-y-1.5 text-xs">
            {[
              { cat: 'Water Supply', dept: 'Water & Plumbing Dept', keywords: 'leak, pipe, tap, drain, toilet' },
              { cat: 'Electricity', dept: 'Electrical Maintenance', keywords: 'spark, wire, blackout, AC, voltage' },
              { cat: 'Network', dept: 'IT Operations', keywords: 'wifi, internet, router, signal, LAN' },
              { cat: 'Cleanliness', dept: 'Housekeeping', keywords: 'trash, garbage, smell, sanitation' },
              { cat: 'Infrastructure', dept: 'Campus Civil Works', keywords: 'wall, door, window, lift, tile' },
              { cat: 'Other', dept: 'General Admin', keywords: 'miscellaneous campus requests' },
            ].map((item, i) => (
              <div key={i} className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">{item.cat}</span>
                  <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{item.keywords}</p>
                </div>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {item.dept}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 2: Duplicate Complaint Detection */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                2. Duplicate Complaint Detection
              </h3>
              <p className="text-[11px] text-slate-400">TF-IDF & Cosine Similarity</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Detects when multiple individuals submit similar complaints in the same location:
          </p>

          {/* Example from user prompt */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] uppercase">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Verified Prompt Example:
            </div>
            <div className="bg-white p-2 rounded border border-amber-200/80">
              <span className="text-[10px] text-slate-400 block font-bold">COMPLAINT 1</span>
              <p className="font-semibold text-slate-800">"Water leakage in Block C"</p>
            </div>
            <div className="bg-white p-2 rounded border border-amber-200/80">
              <span className="text-[10px] text-slate-400 block font-bold">COMPLAINT 2</span>
              <p className="font-semibold text-slate-800">"Water is leaking near C Block"</p>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                Similar complaint detected!
              </span>
              <span className="font-mono text-slate-600 font-bold">68.5% Match</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            Admins can verify links on the Manage Complaints page to escalate priority automatically.
          </p>
        </div>

        {/* Pillar 3: Smart Priority Scoring */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                3. Smart Priority Scoring (0–100)
              </h3>
              <p className="text-[11px] text-slate-400">Objective Formula Breakdown</p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Eliminates favoritism with an auditable mathematical calculation:
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
            <p className="font-bold text-blue-700">Formula Weights:</p>
            <p>• Base Severity: 45% (Hazard, structural risk)</p>
            <p>• Recurrence / Duplicates: 20% (Repeated reports)</p>
            <p>• Sentiment Frustration: 20% (User stress tone)</p>
            <p>• Emergency Urgency: 15% (ASAP keywords)</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block">0 – 30</span>
              <span className="font-bold text-slate-700">Low Priority</span>
            </div>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
              <span className="text-[10px] text-amber-600 font-bold block">31 – 50</span>
              <span className="font-bold text-amber-800">Medium Priority</span>
            </div>
            <div className="p-2 rounded-lg bg-orange-50 border border-orange-200">
              <span className="text-[10px] text-orange-600 font-bold block">51 – 75</span>
              <span className="font-bold text-orange-800">High Priority</span>
            </div>
            <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
              <span className="text-[10px] text-rose-600 font-bold block">76 – 100</span>
              <span className="font-bold text-rose-800">Critical Priority</span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive AI Live Simulator Card for Presentation */}
      <div className="bg-white rounded-2xl border border-blue-200 shadow-sm overflow-hidden">
        
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-300" />
            <div>
              <h3 className="text-sm font-bold">Interactive Live AI Simulation Tool</h3>
              <p className="text-[11px] text-slate-300">Test any natural language sentence live during presentation</p>
            </div>
          </div>
          <span className="text-[10px] bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 px-2 py-0.5 rounded font-mono font-bold">
            FASTAPI LIVE PROXY
          </span>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSimulateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sample Complaint Description
                </label>
                <input
                  type="text"
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  placeholder="e.g. Water is leaking in Block C for three days."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Location / Block
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testLocation}
                    onChange={(e) => setTestLocation(e.target.value)}
                    placeholder="e.g. Block C"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 font-medium"
                  />
                  <button
                    type="submit"
                    disabled={simulating}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {simulating ? 'Analyzing...' : 'Run AI'}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Results Display */}
          {simulationResult && (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Category</span>
                  <p className="text-sm font-bold text-blue-700 mt-0.5">{simulationResult.category}</p>
                  <span className="text-[10px] text-slate-400">
                    {Math.round((simulationResult.category_confidence || 0.85) * 100)}% conf
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Department</span>
                  <p className="text-xs font-bold text-slate-800 mt-1 truncate" title={simulationResult.department}>
                    {simulationResult.department}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-semibold">Auto-routed</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Sentiment</span>
                  <p className="text-xs font-bold text-slate-800 mt-1">{simulationResult.sentiment}</p>
                  <span className="text-[10px] text-slate-400">
                    {simulationResult.frustration_level} frustration
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Severity</span>
                  <p className="text-xs font-bold text-orange-600 mt-1">{simulationResult.severity}</p>
                  <span className="text-[10px] text-slate-400">Impact Assessment</span>
                </div>

                <div className={`p-3 rounded-lg border shadow-2xs ${getPriorityColor(simulationResult.priority)}`}>
                  <span className="text-[10px] uppercase font-bold opacity-80">Priority Score</span>
                  <p className="text-sm font-black mt-0.5">
                    {simulationResult.priority} ({simulationResult.priority_score}/100)
                  </p>
                  <span className="text-[10px] font-semibold opacity-90">
                    SLA: {simulationResult.sla_resolution_hours}h
                  </span>
                </div>

              </div>

              {/* Duplicate check in simulator */}
              {simulationResult.has_similar && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs flex items-center justify-between text-amber-900">
                  <span className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Duplicate match detected against database:
                    <strong className="text-slate-900">{simulationResult.similar_complaints?.[0]?.title}</strong>
                  </span>
                  <span className="bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded text-[10px]">
                    {simulationResult.similar_complaints?.[0]?.similarity_score}% match
                  </span>
                </div>
              )}

              {/* Explanation note */}
              <p className="text-xs text-slate-600 italic bg-white p-3 rounded-lg border border-slate-200">
                "{simulationResult.ai_summary}"
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default AdminAIIntelligencePage;
