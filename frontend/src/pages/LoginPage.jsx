import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, Mail, Lock, LogIn, AlertCircle, Shield, User } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (data.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-navy-900 px-8 py-6 text-center text-white border-b border-navy-800">
          <div className="w-12 h-12 mx-auto rounded-xl bg-blue-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-blue-500/30">
            <Layers className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Sign In to NEXUS</h2>
          <p className="text-xs text-slate-300 mt-1">
            Access your complaint intelligence dashboard
          </p>
        </div>

        {/* Form */}
        <div className="p-8 space-y-6">
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@nexus.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-semibold text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* One Click Demo Credentials */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center font-semibold mb-2">
              Instant Demo Credentials:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('admin@nexus.com', 'admin123')}
                className="p-2 text-xs rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('john@nexus.com', 'user123')}
                className="p-2 text-xs rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                User Demo
              </button>
            </div>
          </div>

          {/* Signup link */}
          <p className="text-xs text-slate-500 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Create an account
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
