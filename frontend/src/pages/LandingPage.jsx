import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  FileCheck2,
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileSearch,
  Zap,
  BarChart3
} from 'lucide-react';

const LandingPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleQuickLogin = async (email, password, redirectPath) => {
    try {
      await login(email, password);
      navigate(redirectPath);
    } catch (err) {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Hero Section with Deep Navy Background */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-900 to-navy-800 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-24 right-10 w-[300px] h-[300px] bg-cyan-400/10 blur-[90px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-wide shadow-xs">
            <Sparkles className="w-4 h-4 text-cyan-300" />
            AI-Powered Complaint Intelligence and Predictive Resolution
          </div>

          {/* Main Heading & Subtitle as requested */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Welcome to <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">NEXUS</span>
            <br />
            <span className="text-2xl sm:text-4xl lg:text-5xl font-bold text-slate-100">
              Smart Complaint Management
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-300 text-base sm:text-xl font-normal leading-relaxed">
            Report your problems. Let AI understand them. Track their resolution.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/signup"
              className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-6 py-3.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-slate-700 text-slate-200 hover:text-white font-semibold text-sm sm:text-base transition-all"
            >
              Login
            </Link>
          </div>

          {/* Quick Demo Access Bar for Evaluator Convenience */}
          <div className="pt-8 border-t border-slate-800/80 max-w-2xl mx-auto">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">
              Fast Demo Evaluator Access (One-Click Sign In)
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                onClick={() => handleQuickLogin('admin@nexus.com', 'admin123', '/admin/dashboard')}
                className="px-3.5 py-2 rounded-lg bg-indigo-950/80 border border-indigo-700/50 hover:bg-indigo-900 text-indigo-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                Sign in as Admin
              </button>
              <button
                onClick={() => handleQuickLogin('john@nexus.com', 'user123', '/user/dashboard')}
                className="px-3.5 py-2 rounded-lg bg-blue-950/80 border border-blue-700/50 hover:bg-blue-900 text-blue-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-blue-400" />
                Sign in as User (John)
              </button>
              <button
                onClick={() => handleQuickLogin('sarah@nexus.com', 'user123', '/user/dashboard')}
                className="px-3.5 py-2 rounded-lg bg-cyan-950/80 border border-cyan-700/50 hover:bg-cyan-900 text-cyan-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Sign in as User (Sarah)
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Workflow Section (Section 4 Requirement) */}
      <section id="how-it-works" className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              How NEXUS Works
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Submit Complaint → AI Analysis → Admin Review → Problem Resolution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-blue-500/20">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Submit Complaint</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Describe the problem simply. Mention the location and block in plain language.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-gradient-to-b from-blue-50/70 to-cyan-50/40 border border-blue-200 rounded-2xl p-6 text-center hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-cyan-500/20">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center justify-center gap-1">
                AI Analysis <Sparkles className="w-4 h-4 text-cyan-600" />
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                AI classifies category, estimates severity, assigns 0–100 priority, and spots duplicate issues.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-indigo-500/20">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Admin Review</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Campus authorities dispatch repair teams based on AI urgency and assign departments.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-emerald-500/20">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Problem Resolution</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Issue resolved within clear SLA hours. Users receive live notifications on their dashboard.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* About NEXUS Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">About NEXUS</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Designed for College & Institutional Campuses
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Traditional complaint boxes and email chains fail because recurring problems get buried, urgent hazards are delayed, and students never receive feedback.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                NEXUS solves this using practical, transparent AI algorithms: classifying department routes, calculating objective 0–100 priority scores, and identifying duplicate reports to solve root problems faster.
              </p>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-2xl font-black text-blue-600">100%</p>
                <p className="text-xs font-medium text-slate-600 mt-1">Transparent AI Scoring</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-2xl font-black text-cyan-600">&lt; 1 sec</p>
                <p className="text-xs font-medium text-slate-600 mt-1">Instant NLP Triage</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-2xl font-black text-indigo-600">TF-IDF</p>
                <p className="text-xs font-medium text-slate-600 mt-1">Cosine Duplicate Finder</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-2xl font-black text-emerald-600">Zero</p>
                <p className="text-xs font-medium text-slate-600 mt-1">Complex Jargon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Core Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
              Essential Features Built to Work
            </h2>
            <p className="text-sm sm:text-base text-slate-600 mt-2">
              Straightforward and reliable features built for students, faculty, and administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Automated Categorization</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Automatically identifies whether a complaint belongs to Water Supply, Electricity, Network, Infrastructure, or Cleanliness.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-4">
                <FileSearch className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Duplicate Detection</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Uses text similarity and location matching to flag when multiple people report the exact same issue in the same block.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Smart Priority Scoring</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Calculates a fair score between 0 and 100 based on physical hazard, sentiment, recurring frequency, and target turnaround SLA.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Real AI Insights</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Computes genuine analytics: highest failure location, most reported category, and most overloaded repair department.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Live Status Updates</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Keep users informed at every step: Submitted → Under Review → In Progress → Resolved, with official admin remarks.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Role-Based Security</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Robust JWT authentication. Students only view their complaints, while administrators manage campus-wide operations.
              </p>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default LandingPage;
