import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Car,
  Wrench,
  CalendarCheck,
  Receipt,
  BarChart2,
  Users,
  Calculator,
  ShieldCheck,
  Clock,
  FileText,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  Settings,
  ArrowRight,
  Github,
  ExternalLink
} from 'lucide-react';
import { api } from './services/api';
import DashboardView from './components/DashboardView';
import {
  GarageView,
  ModificationsView,
  MaintenanceView,
  FuelExpensesView,
  AnalyticsView,
  CommunityView,
  ReportsView
} from './components/OtherViews';
import {
  AddVehicleModal,
  AddModificationModal,
  LogMaintenanceModal,
  AddFuelExpenseModal,
  CostCalculatorModal,
  CompatibilityCheckerModal,
  BuildComparisonModal
} from './components/Modals';

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'addVehicle', 'addMod', 'logMaintenance', 'addFuel', 'costCalc', 'compatCheck', 'compareBuilds'
  const [showUserMenu, setShowUserMenu] = useState(false);

  const loadData = async () => {
    try {
      const [dash, comp] = await Promise.all([
        api.getDashboard(),
        api.getBuildComparison()
      ]);
      setDashboardData(dash);
      setComparisonData(comp);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLikePost = async (id) => {
    try {
      await api.likePost(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookmarkPost = async (id) => {
    try {
      await api.bookmarkPost(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard },
    { name: 'My Garage', icon: Car },
    { name: 'Modifications', icon: Wrench },
    { name: 'Maintenance', icon: CalendarCheck },
    { name: 'Fuel & Expenses', icon: Receipt },
    { name: 'Analytics', icon: BarChart2 },
    { name: 'Community', icon: Users }
  ];

  const toolItems = [
    { name: 'Cost Calculator', icon: Calculator, action: () => setActiveModal('costCalc') },
    { name: 'Compatibility Check', icon: ShieldCheck, action: () => setActiveModal('compatCheck') },
    { name: 'Service Reminders', icon: Clock, action: () => setActiveNav('Maintenance') },
    { name: 'Reports', icon: FileText, action: () => setActiveNav('Reports') }
  ];

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      {/* 1. Left Sidebar */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo-area">
          <div className="logo-badge">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <div>
            <div className="logo-text-title">ModVault</div>
            <div className="logo-text-subtitle">Build · Maintain · Drive</div>
          </div>
        </div>

        {/* Main Nav Items */}
        <nav className="sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.name;
            return (
              <button
                key={item.name}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveNav(item.name)}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Tools Section */}
        <div className="sidebar-section-label">Tools</div>
        <nav className="sidebar-nav-list">
          {toolItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.name;
            return (
              <button
                key={item.name}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveNav(item.name);
                  }
                }}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Dream Build CTA Card */}
        <div className="sidebar-cta-card">
          <div className="cta-title">Your Dream Build Starts Here</div>
          <div className="cta-desc">Plan modifications, track costs, compare builds and more.</div>
          <button
            className="cta-btn"
            onClick={() => setActiveNav('Modifications')}
          >
            Go to Build Planner <ArrowRight size={13} />
          </button>
        </div>

        {/* Bottom User Profile */}
        <div className="sidebar-profile">
          <div className="profile-avatar-circle">
            {dashboardData?.userFullName ? dashboardData.userFullName.charAt(0) : 'G'}
          </div>
          <div className="profile-info">
            <div className="profile-name">{dashboardData?.userFullName || 'Geethika'}</div>
            <a
              href="mailto:24eg105t34@anurag.edu.in"
              className="profile-email"
              title="Student Email: 24eg105t34@anurag.edu.in"
              style={{ textDecoration: 'none', color: '#94a3b8', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              24eg105t34@anurag.edu.in
            </a>
          </div>
          <a
            href="https://github.com/24eg105t44-max"
            target="_blank"
            rel="noopener noreferrer"
            className="profile-settings-btn"
            title="GitHub Account (24eg105t34@anurag.edu.in)"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#94a3b8' }}
          >
            <Github size={16} />
          </a>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="main-wrapper">
        {/* Top Header */}
        <header className="top-header" style={{ position: 'relative' }}>
          <div className="search-bar-box">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              className="search-input"
              placeholder="Search vehicles, parts, modifications, or anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="header-right-actions">
            <a
              href="https://github.com/24eg105t44-max"
              target="_blank"
              rel="noopener noreferrer"
              className="icon-btn"
              title="GitHub Account: 24eg105t34@anurag.edu.in"
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Github size={18} />
            </a>

            <button className="icon-btn" title="Notifications">
              <Bell size={18} />
              <span className="badge-dot" />
            </button>

            <button
              className="icon-btn"
              title="Toggle Theme"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun size={18} /> : <Sun size={18} />}
            </button>

            <div style={{ position: 'relative' }}>
              <button
                className="user-dropdown-btn"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="header-avatar">
                  {dashboardData?.userFullName ? dashboardData.userFullName.charAt(0) : 'G'}
                </div>
                <span className="user-greeting-name">
                  Hi, {dashboardData?.userFullName || 'Geethika'}
                </span>
                <ChevronDown size={14} color="#64748b" />
              </button>

              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '115%',
                    right: 0,
                    width: 270,
                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                    border: '1px solid rgba(226, 232, 240, 0.8)',
                    borderRadius: 10,
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    zIndex: 9999,
                    padding: 12,
                    fontSize: 13
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottom: '1px solid rgba(148, 163, 184, 0.2)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                      G
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>Geethika</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>Roll: 24EG105T34</div>
                      <div style={{ fontSize: 11, color: '#2563eb' }}>24eg105t34@anurag.edu.in</div>
                    </div>
                  </div>

                  <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: 6 }}>
                    GitHub Repositories
                  </div>
                  <a
                    href="https://github.com/24eg105t44-max/modvault-frontend"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, textDecoration: 'none', color: 'inherit', marginBottom: 4 }}
                    className="menu-item-hover"
                  >
                    <Github size={14} />
                    <span>Frontend Repo</span>
                    <ExternalLink size={12} style={{ marginLeft: 'auto', color: '#94a3b8' }} />
                  </a>
                  <a
                    href="https://github.com/24eg105t44-max/modvault-backend"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, textDecoration: 'none', color: 'inherit', marginBottom: 4 }}
                    className="menu-item-hover"
                  >
                    <Github size={14} />
                    <span>Backend Repo (Java)</span>
                    <ExternalLink size={12} style={{ marginLeft: 'auto', color: '#94a3b8' }} />
                  </a>
                  <a
                    href="https://github.com/24eg105t44-max"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, textDecoration: 'none', color: 'inherit', marginBottom: 8 }}
                    className="menu-item-hover"
                  >
                    <ExternalLink size={14} />
                    <span>GitHub Profile</span>
                  </a>

                  <div style={{ paddingTop: 8, borderTop: '1px solid rgba(148, 163, 184, 0.2)', fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
                    Spring Boot 3 + Java 21 REST API
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* View Routing */}
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            Loading ModVault Garage...
          </div>
        ) : (
          <>
            {activeNav === 'Dashboard' && (
              <DashboardView
                dashboardData={dashboardData}
                onOpenModal={setActiveModal}
                setActiveNav={setActiveNav}
                onLikeCommunityPost={handleLikePost}
                onBookmarkCommunityPost={handleBookmarkPost}
              />
            )}

            {activeNav === 'My Garage' && (
              <GarageView
                vehicles={dashboardData?.vehicles || []}
                onRefresh={loadData}
                onOpenAdd={() => setActiveModal('addVehicle')}
              />
            )}

            {activeNav === 'Modifications' && (
              <ModificationsView
                modifications={dashboardData?.recentModifications || []}
                onRefresh={loadData}
                onOpenAdd={() => setActiveModal('addMod')}
              />
            )}

            {activeNav === 'Maintenance' && (
              <MaintenanceView
                reminders={dashboardData?.upcomingMaintenance || []}
                onRefresh={loadData}
                onOpenAdd={() => setActiveModal('logMaintenance')}
              />
            )}

            {activeNav === 'Fuel & Expenses' && (
              <FuelExpensesView
                onOpenAdd={() => setActiveModal('addFuel')}
              />
            )}

            {activeNav === 'Analytics' && (
              <AnalyticsView
                dashboardData={dashboardData}
              />
            )}

            {activeNav === 'Community' && (
              <CommunityView
                posts={dashboardData?.communityPosts || []}
                onLike={handleLikePost}
                onBookmark={handleBookmarkPost}
                onRefresh={loadData}
              />
            )}

            {activeNav === 'Reports' && (
              <ReportsView
                dashboardData={dashboardData}
              />
            )}
          </>
        )}
      </div>

      {/* 3. Modals */}
      <AddVehicleModal
        isOpen={activeModal === 'addVehicle'}
        onClose={() => setActiveModal(null)}
        onRefresh={loadData}
      />

      <AddModificationModal
        isOpen={activeModal === 'addMod'}
        onClose={() => setActiveModal(null)}
        onRefresh={loadData}
        vehicles={dashboardData?.vehicles}
      />

      <LogMaintenanceModal
        isOpen={activeModal === 'logMaintenance'}
        onClose={() => setActiveModal(null)}
        onRefresh={loadData}
      />

      <AddFuelExpenseModal
        isOpen={activeModal === 'addFuel'}
        onClose={() => setActiveModal(null)}
        onRefresh={loadData}
      />

      <CostCalculatorModal
        isOpen={activeModal === 'costCalc'}
        onClose={() => setActiveModal(null)}
      />

      <CompatibilityCheckerModal
        isOpen={activeModal === 'compatCheck'}
        onClose={() => setActiveModal(null)}
      />

      <BuildComparisonModal
        isOpen={activeModal === 'compareBuilds'}
        onClose={() => setActiveModal(null)}
        comparisonData={comparisonData}
      />
    </div>
  );
}
