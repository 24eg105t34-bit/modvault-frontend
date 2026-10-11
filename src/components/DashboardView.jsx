import React from 'react';
import {
  Car,
  Wrench,
  Fuel,
  CreditCard,
  Calendar,
  AlertTriangle,
  ChevronRight,
  MoreHorizontal,
  Flame,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Share2,
  Plus
} from 'lucide-react';
import DualChart from './DualChart';
import DonutChart from './DonutChart';

export default function DashboardView({
  dashboardData,
  onOpenModal,
  setActiveNav,
  onLikeCommunityPost,
  onBookmarkCommunityPost
}) {
  const data = dashboardData || {};
  const vehicles = data.vehicles || [];
  const upcomingMaintenance = data.upcomingMaintenance || [];
  const recentActivities = data.recentActivities || [];
  const recentModifications = data.recentModifications || [];
  const activeBuild = data.activeBuildPlan || {
    title: 'Civic Performance Build',
    estimatedCost: 250000,
    progressPercentage: 68,
    tags: 'Engine,Suspension,Wheels & Tyres,Exhaust,Exterior',
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80'
  };
  const communityPosts = data.communityPosts || [];

  return (
    <div className="page-body">
      {/* 1. Greeting Section */}
      <div className="greeting-row">
        <div>
          <h1 className="greeting-title">{data.greeting || 'Good morning, Geethika 👋'}</h1>
          <p className="greeting-subtitle">Here's what's happening with your garage today.</p>
        </div>
        <div className="date-pill">
          <Calendar size={15} color="#2563eb" />
          <span>{data.dateString || 'Sat, 28 Sep 2025'}</span>
        </div>
      </div>

      {/* 2. Top Metric Cards (4 in a row) */}
      <div className="metrics-grid">
        {/* Card 1: Total Vehicles */}
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
              <Car size={22} />
            </div>
            <div>
              <div className="stat-label">Total Vehicles</div>
              <div className="stat-value">{data.totalVehicles || 2}</div>
            </div>
          </div>
          <div className="stat-card-sub">
            <span style={{ color: '#64748b' }}>In Garage</span>
            <span className="tag-badge emerald">+ 1 new</span>
          </div>
        </div>

        {/* Card 2: Pending Maintenance */}
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
              <Wrench size={22} />
            </div>
            <div>
              <div className="stat-label">Pending Maintenance</div>
              <div className="stat-value">{data.pendingMaintenanceCount || 3}</div>
            </div>
          </div>
          <div className="stat-card-sub">
            <span style={{ color: '#64748b' }}>Services due soon</span>
            <span className="tag-badge amber">
              <AlertTriangle size={12} /> 2 overdue
            </span>
          </div>
        </div>

        {/* Card 3: Monthly Fuel Cost */}
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
              <Fuel size={22} />
            </div>
            <div>
              <div className="stat-label">Monthly Fuel Cost</div>
              <div className="stat-value">₹ {(data.monthlyFuelCost || 4320).toLocaleString()}</div>
            </div>
          </div>
          <div className="stat-card-sub">
            <span style={{ color: '#10b981', fontWeight: 600 }}>{data.fuelCostTrend || '↓ 12% vs last month'}</span>
          </div>
        </div>

        {/* Card 4: Total Expenses (MTD) */}
        <div className="stat-card">
          <div className="stat-card-top">
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#f0f9ff', color: '#0284c7' }}>
              <CreditCard size={22} />
            </div>
            <div>
              <div className="stat-label">Total Expenses (MTD)</div>
              <div className="stat-value">₹ {(data.totalExpensesMtd || 18750).toLocaleString()}</div>
            </div>
          </div>
          <div className="stat-card-sub">
            <span style={{ color: '#10b981', fontWeight: 600 }}>{data.expensesTrend || '↓ 8% vs last month'}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Grid (Left Columns + Right Sidebar Column) */}
      <div className="dashboard-main-grid">
        {/* LEFT COLUMN */}
        <div className="grid-left-col">
          {/* Row 1: My Garage + Quick Actions */}
          <div className="garage-action-split">
            {/* My Garage Card */}
            <div className="card">
              <div className="card-header-flex">
                <h2 className="card-title">My Garage</h2>
                <button
                  className="view-all-link"
                  onClick={() => setActiveNav('My Garage')}
                  style={{ background: 'none', border: 'none' }}
                >
                  View All <ChevronRight size={14} />
                </button>
              </div>

              <div className="vehicles-grid-inner">
                {vehicles.slice(0, 2).map((vehicle) => (
                  <div key={vehicle.id} className="vehicle-card-item">
                    <div className="vehicle-img-wrapper">
                      <img
                        src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=600&q=80'}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        className="vehicle-img"
                      />
                    </div>
                    <div className="vehicle-content">
                      <div className="vehicle-title-row">
                        <div className="vehicle-name-badge">
                          <span className="vehicle-name">
                            {vehicle.make} {vehicle.model} {vehicle.year}
                          </span>
                          <span className={`tag-badge ${vehicle.isPrimary ? 'blue' : 'emerald'}`}>
                            {vehicle.statusBadge || (vehicle.isPrimary ? 'Primary' : 'Secondary')}
                          </span>
                        </div>
                        <MoreHorizontal size={15} color="#94a3b8" style={{ cursor: 'pointer' }} />
                      </div>

                      <div className="vehicle-reg">{vehicle.registrationNumber}</div>

                      <div className="vehicle-specs-grid">
                        <div className="vehicle-spec-pill">
                          <Fuel size={12} color="#64748b" /> {vehicle.fuelType || 'Petrol'}
                        </div>
                        <div className="vehicle-spec-pill">
                          <Car size={12} color="#64748b" /> {vehicle.engineCapacity || '1.8 L'}
                        </div>
                        <div className="vehicle-spec-pill">
                          <Wrench size={12} color="#64748b" /> {(vehicle.odometerKm || 42350).toLocaleString()} km
                        </div>
                        <div className="vehicle-spec-pill">
                          <CreditCard size={12} color="#64748b" /> {vehicle.transmission || 'Manual'}
                        </div>
                      </div>

                      <button
                        className="vehicle-view-link"
                        onClick={() => setActiveNav('My Garage')}
                        style={{ background: 'none', border: 'none', padding: 0 }}
                      >
                        View Details <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="card">
              <div className="card-header-flex">
                <h2 className="card-title">Quick Actions</h2>
              </div>

              <div className="quick-actions-list">
                <div className="quick-action-item" onClick={() => onOpenModal('addVehicle')}>
                  <div className="quick-action-left">
                    <div className="quick-action-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                      <Car size={16} />
                    </div>
                    <div>
                      <div className="quick-action-title">Add New Vehicle</div>
                      <div className="quick-action-sub">Register a new car in your garage</div>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#94a3b8" />
                </div>

                <div className="quick-action-item" onClick={() => onOpenModal('addMod')}>
                  <div className="quick-action-left">
                    <div className="quick-action-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                      <Wrench size={16} />
                    </div>
                    <div>
                      <div className="quick-action-title">Add Modification</div>
                      <div className="quick-action-sub">Plan and track your build</div>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#94a3b8" />
                </div>

                <div className="quick-action-item" onClick={() => onOpenModal('logMaintenance')}>
                  <div className="quick-action-left">
                    <div className="quick-action-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                      <Wrench size={16} />
                    </div>
                    <div>
                      <div className="quick-action-title">Log Maintenance</div>
                      <div className="quick-action-sub">Record service or repair</div>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#94a3b8" />
                </div>

                <div className="quick-action-item" onClick={() => onOpenModal('addFuel')}>
                  <div className="quick-action-left">
                    <div className="quick-action-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                      <Fuel size={16} />
                    </div>
                    <div>
                      <div className="quick-action-title">Add Fuel / Expense</div>
                      <div className="quick-action-sub">Track your spending</div>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#94a3b8" />
                </div>

                <div className="quick-action-item" onClick={() => onOpenModal('costCalc')}>
                  <div className="quick-action-left">
                    <div className="quick-action-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>
                      <CreditCard size={16} />
                    </div>
                    <div>
                      <div className="quick-action-title">Use Cost Calculator</div>
                      <div className="quick-action-sub">Estimate build & running costs</div>
                    </div>
                  </div>
                  <ChevronRight size={15} color="#94a3b8" />
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Fuel & Expense Overview + Expense Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: 20 }}>
            {/* Fuel & Expense Overview Chart */}
            <div className="card">
              <div className="card-header-flex">
                <h2 className="card-title">Fuel & Expense Overview</h2>
              </div>
              <DualChart chartData={data.fuelExpenseChart} />
            </div>

            {/* Expense Breakdown Donut */}
            <div className="card">
              <div className="card-header-flex">
                <h2 className="card-title">Expense Breakdown</h2>
              </div>
              <DonutChart breakdownData={data.expenseBreakdown} />
            </div>
          </div>

          {/* Row 3: Build Planner + Recent Modifications + Build Comparison */}
          <div className="bottom-sections-grid">
            {/* Build Planner Card */}
            <div className="card build-planner-card">
              <div className="card-header-flex">
                <h2 className="card-title">Build Planner</h2>
                <button
                  className="view-all-link"
                  onClick={() => setActiveNav('Modifications')}
                  style={{ background: 'none', border: 'none' }}
                >
                  View All <ChevronRight size={14} />
                </button>
              </div>

              <div className="build-card-preview">
                <img
                  src={activeBuild.imageUrl}
                  alt={activeBuild.title}
                  className="build-preview-img"
                />
                <div className="build-preview-body">
                  <div className="build-title-row">
                    <span className="build-name">{activeBuild.title}</span>
                    <span className="tag-badge blue">In Progress</span>
                  </div>

                  <div style={{ fontSize: 11, color: '#64748b' }}>Estimated Cost</div>
                  <div className="build-cost-val">₹ {(activeBuild.estimatedCost || 250000).toLocaleString()}</div>

                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${activeBuild.progressPercentage || 68}%` }}
                    />
                  </div>
                  <div className="progress-label-text">{activeBuild.progressPercentage || 68}% completed</div>

                  <div className="build-tags-row">
                    {(activeBuild.tags ? activeBuild.tags.split(',') : ['Engine', 'Suspension', 'Wheels & Tyres', 'Exhaust', 'Exterior']).map((tag) => (
                      <span key={tag} className="build-tag-pill">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Modifications Table */}
            <div className="card">
              <div className="card-header-flex">
                <h2 className="card-title">Recent Modifications</h2>
                <button
                  className="view-all-link"
                  onClick={() => setActiveNav('Modifications')}
                  style={{ background: 'none', border: 'none' }}
                >
                  View All <ChevronRight size={14} />
                </button>
              </div>

              <table className="mods-table">
                <thead>
                  <tr>
                    <th>Part / Modification</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {recentModifications.slice(0, 4).map((mod) => (
                    <tr key={mod.id}>
                      <td style={{ fontWeight: 600 }}>{mod.partName}</td>
                      <td style={{ color: '#64748b' }}>{mod.category}</td>
                      <td>
                        <span className={`tag-badge ${mod.status === 'Installed' ? 'emerald' : 'amber'}`}>
                          {mod.status}
                        </span>
                      </td>
                      <td style={{ fontWeight: 700 }}>₹ {(mod.cost || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Build Comparison Card */}
            <div className="card build-compare-card">
              <div className="card-header-flex">
                <h2 className="card-title">Build Comparison</h2>
                <button
                  className="view-all-link"
                  onClick={() => onOpenModal('compareBuilds')}
                  style={{ background: 'none', border: 'none' }}
                >
                  View All <ChevronRight size={14} />
                </button>
              </div>

              <div className="compare-cars-row">
                <div className="compare-car-box">
                  <img
                    src="https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=400&q=80"
                    alt="Civic Stock"
                    className="compare-car-img"
                  />
                  <div className="compare-car-title">Civic (Stock)</div>
                  <div className="compare-car-stat">₹ 18.5 L</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>12.5 km/l</div>
                </div>

                <div className="vs-badge">VS</div>

                <div className="compare-car-box" style={{ borderColor: '#2563eb' }}>
                  <img
                    src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=400&q=80"
                    alt="Civic Modified"
                    className="compare-car-img"
                  />
                  <div className="compare-car-title" style={{ color: '#2563eb' }}>Civic (Modified)</div>
                  <div className="compare-car-stat" style={{ color: '#2563eb', fontWeight: 700 }}>₹ 24.8 L</div>
                  <div style={{ fontSize: 10, color: '#94a3b8' }}>11.2 km/l</div>
                </div>
              </div>

              <button
                className="btn-primary"
                style={{ width: '100%', fontSize: 12, padding: '8px 12px', marginTop: 4 }}
                onClick={() => onOpenModal('compareBuilds')}
              >
                Compare Builds <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR COLUMN */}
        <div className="grid-right-col">
          {/* 1. Upcoming Maintenance */}
          <div className="card">
            <div className="card-header-flex">
              <h2 className="card-title">Upcoming Maintenance</h2>
              <button
                className="view-all-link"
                onClick={() => setActiveNav('Maintenance')}
                style={{ background: 'none', border: 'none' }}
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div className="maintenance-items-list">
              {upcomingMaintenance.slice(0, 4).map((item) => (
                <div key={item.id} className="maintenance-item-row">
                  <div className="maintenance-left-info">
                    <div
                      className="maintenance-icon-bubble"
                      style={{
                        background: item.status === 'Upcoming' ? '#eff6ff' : '#fffbeb',
                        color: item.status === 'Upcoming' ? '#2563eb' : '#f59e0b'
                      }}
                    >
                      <Wrench size={16} />
                    </div>
                    <div>
                      <div className="maintenance-name">{item.title}</div>
                      <div className="maintenance-sub">
                        {(item.intervalKm || 5000).toLocaleString()} km • {item.dueDate || '15 Oct 2025'}
                      </div>
                    </div>
                  </div>

                  <span className={`tag-badge ${item.status === 'Upcoming' ? 'blue' : 'amber'}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Recent Activity */}
          <div className="card">
            <div className="card-header-flex">
              <h2 className="card-title">Recent Activity</h2>
              <button
                className="view-all-link"
                onClick={() => setActiveNav('Fuel & Expenses')}
                style={{ background: 'none', border: 'none' }}
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div className="activity-list">
              {recentActivities.slice(0, 4).map((act) => (
                <div key={act.id} className="activity-item-row">
                  <div className="activity-left">
                    <div
                      className="activity-icon-bubble"
                      style={{
                        background: act.type === 'fuel' ? '#eff6ff' : act.type === 'modification' ? '#ecfdf5' : '#fffbeb',
                        color: act.type === 'fuel' ? '#2563eb' : act.type === 'modification' ? '#10b981' : '#f59e0b'
                      }}
                    >
                      {act.type === 'fuel' ? <Fuel size={15} /> : <Wrench size={15} />}
                    </div>
                    <div>
                      <div className="activity-title">{act.title}</div>
                      <div className="activity-sub">{act.vehicleOrCategory}</div>
                    </div>
                  </div>

                  {act.amount && (
                    <div className="activity-amount">+ ₹ {act.amount.toLocaleString()}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Community Feed */}
          <div className="card">
            <div className="card-header-flex">
              <h2 className="card-title">Community</h2>
              <button
                className="view-all-link"
                onClick={() => setActiveNav('Community')}
                style={{ background: 'none', border: 'none' }}
              >
                View All <ChevronRight size={14} />
              </button>
            </div>

            <div className="community-feed-list">
              {communityPosts.slice(0, 2).map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-author-row">
                      <div className="post-author-avatar">
                        {post.authorName ? post.authorName.charAt(0) : 'U'}
                      </div>
                      <div>
                        <div className="post-author-name">{post.authorName}</div>
                        <div className="post-author-car-time">
                          {post.authorCar} • {post.timeAgo || '2 days ago'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="post-content-text">{post.content}</p>

                  {post.imageUrl && (
                    <div className="post-images-grid">
                      <img src={post.imageUrl} alt="Car mod" className="post-img" />
                      {post.additionalImageUrl && (
                        <img src={post.additionalImageUrl} alt="Car exhaust" className="post-img" />
                      )}
                    </div>
                  )}

                  <div className="post-footer-actions">
                    <button
                      className="post-action-btn"
                      onClick={() => onLikeCommunityPost(post.id)}
                    >
                      <ThumbsUp size={13} /> {post.likesCount || 0}
                    </button>
                    <button className="post-action-btn">
                      <MessageSquare size={13} /> {post.commentsCount || 0}
                    </button>
                    <button
                      className="post-action-btn"
                      onClick={() => onBookmarkCommunityPost(post.id)}
                      style={{ color: post.isBookmarked ? '#2563eb' : '#64748b' }}
                    >
                      <Bookmark size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
