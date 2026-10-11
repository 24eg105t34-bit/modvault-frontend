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
  VehicleDetailsModal,
  AddModificationModal,
  LogMaintenanceModal,
  AddFuelExpenseModal,
  CostCalculatorModal,
  CompatibilityCheckerModal,
  BuildComparisonModal
} from './components/Modals';

const DEFAULT_DASHBOARD_DATA = {
  greeting: 'Good morning, Geethika 👋',
  userFullName: 'Geethika',
  dateString: 'Sat, 28 Sep 2025',
  totalVehicles: 2,
  totalVehiclesNote: '+ 1 new',
  pendingMaintenanceCount: 3,
  overdueCount: 2,
  monthlyFuelCost: 4320,
  fuelCostTrend: '↓ 12% vs last month',
  totalExpensesMtd: 18750,
  expensesTrend: '↓ 8% vs last month',
  vehicles: [
    {
      id: 1,
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      registrationNumber: 'TS 09 AB 1234',
      fuelType: 'Petrol',
      engineCapacity: '1.8 L',
      odometerKm: 42350,
      transmission: 'Manual',
      isPrimary: true,
      statusBadge: 'Primary',
      imageUrl: '/images/civic-2019.jpg',
      notes: 'Primary daily driver and active track-day build project.'
    },
    {
      id: 2,
      make: 'BMW',
      model: '330i',
      year: 2022,
      registrationNumber: 'KA 01 CD 5678',
      fuelType: 'Petrol',
      engineCapacity: '2.0 L',
      odometerKm: 18420,
      transmission: 'Automatic',
      isPrimary: false,
      statusBadge: 'Secondary',
      imageUrl: '/images/bmw-330i.jpg',
      notes: 'Weekend cruiser and grand tourer.'
    }
  ],
  upcomingMaintenance: [
    { id: 1, title: 'Engine Oil Change', intervalKm: 4500, dueDate: '2025-10-15', status: 'Due Soon', iconType: 'oil', isOverdue: true },
    { id: 2, title: 'Tyre Rotation', intervalKm: 8000, dueDate: '2025-11-10', status: 'Due Soon', iconType: 'tyre', isOverdue: true },
    { id: 3, title: 'Brake Inspection', intervalKm: 12000, dueDate: '2025-12-28', status: 'Due Soon', iconType: 'brake', isOverdue: false },
    { id: 4, title: 'Air Filter Replacement', intervalKm: 20000, dueDate: '2026-01-15', status: 'Upcoming', iconType: 'filter', isOverdue: false }
  ],
  recentActivities: [
    { id: 1, title: 'Fuel entry added', vehicleOrCategory: 'Honda Civic • 18 Sep 2025, 08:45 PM', timestamp: '2025-09-18T20:45:00', amount: 2500, type: 'fuel', iconColor: 'blue' },
    { id: 2, title: 'Modification updated', vehicleOrCategory: 'BMW 330i • 16 Sep 2025, 02:12 PM', timestamp: '2025-09-16T14:12:00', amount: 18750, type: 'modification', iconColor: 'green' },
    { id: 3, title: 'Service completed', vehicleOrCategory: 'Honda Civic • 12 Sep 2025, 04:21 PM', timestamp: '2025-09-12T16:21:00', amount: null, type: 'maintenance', iconColor: 'green' },
    { id: 4, title: 'Expense added', vehicleOrCategory: 'Car Accessories • 10 Sep 2025, 02:10 PM', timestamp: '2025-09-10T14:10:00', amount: 3200, type: 'expense', iconColor: 'amber' }
  ],
  recentModifications: [
    { id: 1, partName: 'Cold Air Intake', category: 'Performance', status: 'Installed', cost: 25000 },
    { id: 2, partName: 'BC Racing Coilovers', category: 'Suspension', status: 'Installed', cost: 85000 },
    { id: 3, partName: 'Rays 57CR Wheels', category: 'Wheels & Tyres', status: 'Planned', cost: 42000 },
    { id: 4, partName: 'Cat-back Exhaust', category: 'Performance', status: 'Planned', cost: 70000 }
  ],
  activeBuildPlan: {
    id: 1,
    title: 'Civic Performance Build',
    estimatedCost: 250000,
    progressPercentage: 68,
    status: 'In Progress',
    imageUrl: '/images/build-civic.jpg',
    tags: 'Engine,Suspension,Wheels & Tyres,Exhaust,Exterior'
  },
  communityPosts: [
    {
      id: 1,
      authorName: 'Rohan Mehta',
      authorCar: 'BMW 330i',
      timeAgo: '2 days ago',
      content: 'Just got my new M Performance exhaust. The sound is unreal! 🔥',
      imageUrl: '/images/community-bmw-rear.jpg',
      additionalImageUrl: '/images/community-bmw-exhaust.jpg',
      likesCount: 124,
      commentsCount: 18,
      isBookmarked: false
    },
    {
      id: 2,
      authorName: 'Sneha Iyer',
      authorCar: 'Honda Civic',
      timeAgo: '3 days ago',
      content: 'After 10k km, still loving the reliability of my Civic. What a machine! 🚗',
      imageUrl: null,
      additionalImageUrl: null,
      likesCount: 96,
      commentsCount: 12,
      isBookmarked: false
    }
  ],
  fuelExpenseChart: {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    fuelCosts: [2100, 3200, 3800, 4500, 3900, 4320],
    fuelEconomies: [11.8, 12.4, 12.2, 13.5, 12.9, 13.8]
  },
  expenseBreakdown: {
    total: 18750,
    fuel: { percentage: 42, amount: 7875 },
    maintenance: { percentage: 21, amount: 3940 },
    modifications: { percentage: 19, amount: 3560 },
    insurance: { percentage: 10, amount: 1875 },
    others: { percentage: 8, amount: 1500 }
  }
};

const DEFAULT_COMPARISON_DATA = {
  stock: {
    name: 'Civic (Stock)',
    totalCost: '₹ 18.5 L',
    averageMileage: '12.5 km/l',
    power: '141 hp',
    torque: '174 Nm',
    suspension: 'OEM Struts',
    exhaust: 'Factory Twin Resonator',
    imageUrl: '/images/compare-stock.jpg'
  },
  modified: {
    name: 'Civic (Modified)',
    totalCost: '₹ 24.8 L',
    averageMileage: '11.2 km/l',
    power: '215 hp (Stage 2)',
    torque: '290 Nm',
    suspension: 'BC Racing Coilovers (32-way)',
    exhaust: 'Full Cat-back Stainless Steel',
    imageUrl: '/images/compare-modified.jpg'
  }
};

export default function App() {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [dashboardData, setDashboardData] = useState(DEFAULT_DASHBOARD_DATA);
  const [comparisonData, setComparisonData] = useState(DEFAULT_COMPARISON_DATA);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [activeModal, setActiveModal] = useState(null); // 'addVehicle', 'vehicleDetails', 'addMod', 'logMaintenance', 'addFuel', 'costCalc', 'compatCheck', 'compareBuilds'
  const [showUserMenu, setShowUserMenu] = useState(false);

  const loadData = async () => {
    try {
      const [dash, comp] = await Promise.all([
        api.getDashboard(),
        api.getBuildComparison()
      ]);
      if (dash) {
        setDashboardData(dash);
      }
      if (comp) {
        setComparisonData(comp);
      }
    } catch (err) {
      console.warn('Backend API connection note (using screenshot-perfect local data):', err);
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
            href="https://github.com/24eg105t34-bit"
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
              href="https://github.com/24eg105t34-bit"
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
                    href="https://github.com/24eg105t34-bit/modvault-frontend"
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
                    href="https://github.com/24eg105t34-bit/modvault-backend"
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
                    href="https://github.com/24eg105t34-bit"
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
                onSelectVehicle={(v) => { setSelectedVehicle(v); setActiveModal('vehicleDetails'); }}
                searchQuery={searchQuery}
              />
            )}

            {activeNav === 'My Garage' && (
              <GarageView
                vehicles={dashboardData?.vehicles || []}
                onRefresh={loadData}
                onOpenAdd={() => setActiveModal('addVehicle')}
                onSelectVehicle={(v) => { setSelectedVehicle(v); setActiveModal('vehicleDetails'); }}
                searchQuery={searchQuery}
              />
            )}

            {activeNav === 'Modifications' && (
              <ModificationsView
                modifications={dashboardData?.recentModifications || []}
                onRefresh={loadData}
                onOpenAdd={() => setActiveModal('addMod')}
                searchQuery={searchQuery}
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
                dashboardData={dashboardData}
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

      <VehicleDetailsModal
        isOpen={activeModal === 'vehicleDetails'}
        vehicle={selectedVehicle}
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
