import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
  CheckCheck,
  ChevronRight
} from 'lucide-react';

const NotificationsPage = () => {
  const { fetchUnreadCount } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, read: true } : n))
      );
      fetchUnreadCount();
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      fetchUnreadCount();
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'status_change':
        return <Clock className="w-4 h-4 text-blue-600" />;
      case 'ai_insight':
        return <Sparkles className="w-4 h-4 text-cyan-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Notifications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time updates regarding status changes and administrative actions
          </p>
        </div>

        {notifications.some(n => !n.read) && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {loading ? (
          <div className="p-16 text-center text-slate-400 text-sm">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-700">No notifications yet</p>
            <p className="text-xs text-slate-400">
              When an administrator updates your complaint status or remarks, you will be notified here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors ${
                  n.read ? 'bg-white' : 'bg-blue-50/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    n.read ? 'bg-slate-100' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {getIcon(n.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-sm font-bold ${n.read ? 'text-slate-800' : 'text-slate-900'}`}>
                        {n.title}
                      </h4>
                      {n.ticketId && (
                        <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded">
                          {n.ticketId}
                        </span>
                      )}
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(n.createdAt).toLocaleDateString()} at{' '}
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                {!n.read && (
                  <button
                    onClick={() => handleMarkAsRead(n._id)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold shrink-0"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>

    </div>
  );
};

export default NotificationsPage;
