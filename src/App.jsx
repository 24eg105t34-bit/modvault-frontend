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
  ArrowRight
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
            <div className="profile-email">geethika@gmail.com</div>
          </div>
          <button
            className="profile-settings-btn"
            title="Garage Settings"
            onClick={() => alert('ModVault Garage Settings: User Geethika | Backend Connected')}
          >
            <Settings size={16} />
          </button>
        </div>
      </aside>

      {/* 2. Main Content Wrapper */}
      <div className="main-wrapper">
        {/* Top Header */}
        <header className="top-header">
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

            <button className="user-dropdown-btn">
              <div className="header-avatar">
                {dashboardData?.userFullName ? dashboardData.userFullName.charAt(0) : 'G'}
              </div>
              <span className="user-greeting-name">
                Hi, {dashboardData?.userFullName || 'Geethika'}
              </span>
              <ChevronDown size={14} color="#64748b" />
            </button>
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
