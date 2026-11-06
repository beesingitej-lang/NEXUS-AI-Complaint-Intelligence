import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Building, Phone, Calendar, Shield, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          User Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Your personal account details on the NEXUS Platform
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Banner with initials avatar */}
        <div className="bg-navy-900 p-8 text-white flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-blue-500/20">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{user?.name}</h2>
            <p className="text-xs text-slate-300">{user?.email}</p>
            <div className="pt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider bg-blue-500/20 text-cyan-300 border border-cyan-400/30 px-2.5 py-0.5 rounded-full inline-block">
                {user?.role === 'admin' ? 'Campus Administrator' : 'Registered Campus User'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Info Grid */}
        <div className="p-6 sm:p-8 space-y-5">
          
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Account Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <User className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Full Name</p>
                <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Email Address</p>
                <p className="text-sm font-semibold text-slate-900">{user?.email}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Building className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Department / Affiliation</p>
                <p className="text-sm font-semibold text-slate-900">{user?.department || 'General Campus Community'}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Contact Phone</p>
                <p className="text-sm font-semibold text-slate-900">{user?.phone || '+1 (555) 0100'}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Account Created</p>
                <p className="text-sm font-semibold text-slate-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 font-medium">Account Status</p>
                <p className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProfilePage;
