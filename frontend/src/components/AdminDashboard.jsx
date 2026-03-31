import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminInventory from './AdminInventory';
import AdminOrderDashboard from './AdminOrderDashboard';
import AdminInvoices from './AdminInvoices';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const navigate = useNavigate();

  const SESSION_DURATION = 5 * 60 * 1000;
  const RELOAD_INTERVAL = 30 * 1000;

  const handleLogout = () => {
    localStorage.removeItem('klubnikaAdminToken');
    localStorage.removeItem('adminSessionStart');
    navigate('/admin');
  };

  useEffect(() => {
    const initSession = () => {
      const now = Date.now();
      let startTime = localStorage.getItem('adminSessionStart');
      if (!startTime) {
        startTime = now.toString();
        localStorage.setItem('adminSessionStart', startTime);
      }
      const elapsed = now - parseInt(startTime, 10);
      if (elapsed >= SESSION_DURATION) {
        setShowTimeoutModal(true);
        return;
      }
      const remainingTime = SESSION_DURATION - elapsed;
      const logoutTimeout = setTimeout(() => setShowTimeoutModal(true), remainingTime);
      return () => clearTimeout(logoutTimeout);
    };
    return initSession();
  }, []);

  useEffect(() => {
    let reloadTimer;
    if (activeTab === 'orders') {
      reloadTimer = setInterval(() => {
        const currentElapsed = Date.now() - parseInt(localStorage.getItem('adminSessionStart') || '0', 10);
        if (currentElapsed < SESSION_DURATION) window.location.reload();
      }, RELOAD_INTERVAL);
    }
    return () => { if (reloadTimer) clearInterval(reloadTimer); };
  }, [activeTab]);

  const tabs = [
    { id: 'orders', label: 'Live Orders' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'invoices', label: 'Invoices' },
  ];

  return (
    <div className="min-h-screen bg-[#0d0b08] text-[#f0e6d8] p-4 md:p-8 relative">

      {/* Timeout Modal */}
      {showTimeoutModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-[100] p-4">
          <div className="glass-card p-6 md:p-8 shadow-2xl border border-[#e85d75]/30 text-center max-w-md w-full animate-fadeIn">
            <div className="text-[#e85d75] text-5xl md:text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2 font-heading">Session Timed Out</h2>
            <p className="text-[#b8a898] mb-8 text-sm md:text-base">
              Your session has expired for security reasons. Please login again to continue.
            </p>
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-[#e85d75] hover:bg-[#d44963] text-white font-bold rounded-lg transition text-lg active:scale-95 cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        </div>
      )}

      {/* Dashboard Content */}
      <div className={`max-w-7xl mx-auto transition-all duration-300 ${showTimeoutModal ? 'blur-md pointer-events-none scale-95' : ''}`}>

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-heading">Admin Portal</h1>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <span className={`text-[10px] md:text-xs px-2 py-1 rounded border uppercase tracking-widest font-medium ${activeTab === 'orders'
              ? 'text-[#d4a574] border-[#d4a574]/30 bg-[#d4a574]/10'
              : 'text-[#8a7d72] border-[#d4a574]/[0.08] bg-[#d4a574]/[0.02]'
              }`}>
              {activeTab === 'orders' ? 'Live Auto-Refresh: 30s' : 'Refresh: Paused'}
            </span>
            <button
              onClick={handleLogout}
              className="flex-1 md:flex-none px-4 py-2 glass-surface text-[#f0e6d8] text-sm font-semibold hover:bg-[#d4a574]/[0.08] transition active:scale-95 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-[#d4a574]/[0.08] mb-6 md:mb-8 -mx-4 px-4 md:mx-0 md:px-0" style={{ scrollbarWidth: 'none' }}>
          <div className="flex space-x-2 md:space-x-4 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-4 md:px-6 text-base md:text-xl font-semibold transition-all relative cursor-pointer ${activeTab === tab.id ? 'text-[#d4a574]' : 'text-[#8a7d72] hover:text-[#b8a898]'
                  }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#d4a574] to-[#c08552]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-fadeIn">
          {activeTab === 'orders' && <AdminOrderDashboard />}
          {activeTab === 'inventory' && <AdminInventory />}
          {activeTab === 'invoices' && <AdminInvoices />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;