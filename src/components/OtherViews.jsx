import React, { useState } from 'react';
import {
  Car, Wrench, Fuel, CreditCard, Plus, Trash2, Edit3, CheckCircle2,
  AlertCircle, ShieldCheck, Download, Calculator, BarChart2, MessageSquare, ThumbsUp, ChevronRight
} from 'lucide-react';
import { api } from '../services/api';

// 1. Garage View
export function GarageView({ vehicles, onRefresh, onOpenAdd, onSelectVehicle, searchQuery = '' }) {
  const filtered = vehicles.filter(v => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.make?.toLowerCase().includes(q) ||
      v.model?.toLowerCase().includes(q) ||
      v.registrationNumber?.toLowerCase().includes(q) ||
      v.statusBadge?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div>
          <h1 className="greeting-title">My Garage Fleet</h1>
          <p className="greeting-subtitle">
            {filtered.length} {filtered.length === 1 ? 'vehicle' : 'vehicles'} registered with active performance telemetry.
          </p>
        </div>
        <button className="btn-primary" onClick={onOpenAdd}>
          <Plus size={16} /> Register Vehicle
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20 }}>
        {filtered.map((v) => {
          const vehicleImg = v.imageUrl && !v.imageUrl.includes('unsplash')
            ? v.imageUrl
            : (v.model?.toLowerCase().includes('civic') || v.make?.toLowerCase().includes('honda')
                ? '/images/civic-2019.jpg'
                : '/images/bmw-330i.jpg');
          return (
            <div key={v.id} className="vehicle-card-item">
              <div className="vehicle-img-wrapper" style={{ height: 180 }}>
                <img
                  src={vehicleImg}
                  alt={v.model}
                  className="vehicle-img"
                  onError={(e) => { e.target.src = '/images/civic-2019.jpg'; }}
                />
              </div>
              <div className="vehicle-content" style={{ padding: 18 }}>
                <div className="vehicle-title-row">
                  <span className="vehicle-name" style={{ fontSize: 16 }}>{v.make} {v.model} {v.year}</span>
                  <span className={`tag-badge ${v.isPrimary ? 'blue' : 'emerald'}`}>
                    {v.statusBadge || (v.isPrimary ? 'Primary' : 'Secondary')}
                  </span>
                </div>
                <div className="vehicle-reg" style={{ fontSize: 13 }}>{v.registrationNumber}</div>
                <p style={{ fontSize: 12, color: '#64748b', minHeight: 32 }}>{v.notes || 'Registered in garage fleet.'}</p>

                <div className="vehicle-specs-grid" style={{ marginTop: 8 }}>
                  <div className="vehicle-spec-pill"><Fuel size={13} /> {v.fuelType || 'Petrol'}</div>
                  <div className="vehicle-spec-pill"><Car size={13} /> {v.engineCapacity || '2.0 L'}</div>
                  <div className="vehicle-spec-pill"><Wrench size={13} /> {(v.odometerKm || 0).toLocaleString()} km</div>
                  <div className="vehicle-spec-pill"><CreditCard size={13} /> {v.transmission || 'Automatic'}</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                  <button
                    className="vehicle-view-link"
                    onClick={() => onSelectVehicle ? onSelectVehicle(v) : null}
                    style={{ background: 'none', border: 'none', padding: 0 }}
                  >
                    View Details <ChevronRight size={13} />
                  </button>

                  <div style={{ display: 'flex', gap: 6 }}>
                    {!v.isPrimary && (
                      <button
                        onClick={async () => {
                          await api.updateVehicle(v.id, { isPrimary: true, statusBadge: 'Primary' });
                          onRefresh();
                        }}
                        style={{ fontSize: 11, background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: 4, padding: '3px 8px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      onClick={async () => {
                        if (confirm(`Remove ${v.make} ${v.model} from garage?`)) {
                          await api.deleteVehicle(v.id);
                          onRefresh();
                        }
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '3px 6px' }}
                      title="Remove Vehicle"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 2. Modifications View
export function ModificationsView({ modifications, onRefresh, onOpenAdd, searchQuery = '' }) {
  const filtered = modifications.filter(m => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return m.partName?.toLowerCase().includes(q) || m.category?.toLowerCase().includes(q);
  });

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div>
          <h1 className="greeting-title">Build Planner & Modifications</h1>
          <p className="greeting-subtitle">Track aftermarket performance parts, suspension, and aesthetic upgrades.</p>
        </div>
        <button className="btn-primary" onClick={onOpenAdd}>
          <Plus size={16} /> Add Modification
        </button>
      </div>

      <div className="card">
        <table className="mods-table">
          <thead>
            <tr>
              <th>Part / Upgrade</th>
              <th>Category</th>
              <th>Status</th>
              <th>Cost (₹)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id}>
                <td style={{ fontWeight: 600, fontSize: 13.5 }}>{m.partName}</td>
                <td><span className="build-tag-pill">{m.category}</span></td>
                <td>
                  <span className={`tag-badge ${m.status === 'Installed' ? 'emerald' : 'amber'}`}>
                    {m.status}
                  </span>
                </td>
                <td style={{ fontWeight: 700, fontSize: 14 }}>₹ {Number(m.cost || 0).toLocaleString()}</td>
                <td>
                  <button
                    onClick={async () => {
                      if (confirm(`Remove ${m.partName}?`)) {
                        await api.deleteModification(m.id);
                        onRefresh();
                      }
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                    title="Remove Modification"
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 3. Maintenance View
export function MaintenanceView({ reminders, onRefresh, onOpenAdd }) {
  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div>
          <h1 className="greeting-title">Maintenance & Service Schedules</h1>
          <p className="greeting-subtitle">Keep vehicles in peak condition with automated alerts and service history.</p>
        </div>
        <button className="btn-primary" onClick={onOpenAdd}>
          <Plus size={16} /> Log Service
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {reminders.map((r) => (
          <div key={r.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className={`tag-badge ${r.status === 'Upcoming' ? 'blue' : 'amber'}`}>{r.status}</span>
              <span style={{ fontSize: 11, color: '#64748b' }}>Due: {r.dueDate}</span>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>{r.title}</h3>
            <p style={{ fontSize: 12, color: '#64748b' }}>Due at {(r.intervalKm || 5000).toLocaleString()} km interval.</p>
            <button
              className="btn-secondary"
              style={{ marginTop: 'auto', fontSize: 12 }}
              onClick={async () => {
                await api.deleteReminder(r.id);
                onRefresh();
              }}
            >
              Mark Completed
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Fuel & Expenses View
export function FuelExpensesView({ dashboardData, onOpenAdd }) {
  const activities = dashboardData?.recentActivities || [];
  const fuelEntries = activities.filter(a => a.type === 'fuel');
  const expenseEntries = activities.filter(a => a.type === 'expense' || a.type === 'modification');

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div>
          <h1 className="greeting-title">Fuel Logs & Expense Ledger</h1>
          <p className="greeting-subtitle">Track consumption, octane grades, cost/km, and running costs.</p>
        </div>
        <button className="btn-primary" onClick={onOpenAdd}>
          <Plus size={16} /> Add Entry
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <h2 className="card-title" style={{ marginBottom: 16 }}>Fuel Refill History</h2>
          <div className="activity-list">
            {fuelEntries.map((f) => (
              <div key={f.id} className="activity-item-row">
                <div>
                  <div style={{ fontWeight: 600 }}>{f.title}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{f.vehicleOrCategory}</div>
                </div>
                <strong style={{ color: '#2563eb' }}>₹ {Number(f.amount || 2500).toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="card-title" style={{ marginBottom: 16 }}>Modifications & Other Expenses</h2>
          <div className="activity-list">
            {expenseEntries.map((e) => (
              <div key={e.id} className="activity-item-row">
                <div>
                  <div style={{ fontWeight: 600 }}>{e.title}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{e.vehicleOrCategory}</div>
                </div>
                <strong style={{ color: '#f59e0b' }}>₹ {Number(e.amount || 1500).toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 5. Analytics View
export function AnalyticsView({ dashboardData }) {
  const totalVehicles = dashboardData?.totalVehicles || 2;
  const monthlyFuel = dashboardData?.monthlyFuelCost || 4320;
  const totalExpenses = dashboardData?.totalExpensesMtd || 18750;

  return (
    <div className="page-body">
      <h1 className="greeting-title">Fleet Analytics & Insights</h1>
      <p className="greeting-subtitle">Cost per kilometer, fuel efficiency trends, and financial breakdown.</p>

      <div className="metrics-grid">
        <div className="stat-card">
          <div className="stat-label">Active Garage Fleet</div>
          <div className="stat-value" style={{ color: '#2563eb' }}>{totalVehicles} Cars</div>
          <div className="stat-card-sub" style={{ color: '#64748b' }}>Monitored vehicles</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Average Fuel Economy</div>
          <div className="stat-value" style={{ color: '#10b981' }}>13.4 km/L</div>
          <div className="stat-card-sub" style={{ color: '#64748b' }}>Fleet composite average</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Running Cost per km</div>
          <div className="stat-value" style={{ color: '#2563eb' }}>₹ 7.82 / km</div>
          <div className="stat-card-sub" style={{ color: '#64748b' }}>Fuel & maintenance included</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">MTD Expenses</div>
          <div className="stat-value" style={{ color: '#0284c7' }}>₹ {totalExpenses.toLocaleString()}</div>
          <div className="stat-card-sub" style={{ color: '#64748b' }}>Month-to-date spending</div>
        </div>
      </div>
    </div>
  );
}

// 6. Community View
export function CommunityView({ posts, onLike, onBookmark, onRefresh }) {
  const [newContent, setNewContent] = useState('');

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    await api.createCommunityPost({
      authorName: 'Geethika',
      authorCar: 'Honda Civic',
      content: newContent
    });
    setNewContent('');
    onRefresh();
  };

  return (
    <div className="page-body">
      <h1 className="greeting-title">ModVault Community Hub</h1>
      <p className="greeting-subtitle">Connect with fellow enthusiasts, share project milestones, and discuss builds.</p>

      <div className="card" style={{ maxWidth: 640 }}>
        <form onSubmit={handlePost}>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Share an update on your car, dyno run, or modification..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
            <button type="submit" className="btn-primary">Post Update</button>
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 640 }}>
        {posts.map((post) => (
          <div key={post.id} className="card" style={{ padding: 18 }}>
            <div className="post-header" style={{ marginBottom: 10 }}>
              <div className="post-author-row">
                <div className="post-author-avatar">{post.authorName?.charAt(0) || 'G'}</div>
                <div>
                  <div className="post-author-name">{post.authorName}</div>
                  <div className="post-author-car-time">{post.authorCar} • {post.timeAgo || 'Just now'}</div>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.5, color: '#1e293b' }}>{post.content}</p>
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt="post"
                style={{ width: '100%', borderRadius: 8, marginTop: 10, height: 200, objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
            <div className="post-footer-actions" style={{ marginTop: 12 }}>
              <button
                className={`post-action-btn ${post.isLiked ? 'liked' : ''}`}
                onClick={() => onLike(post.id)}
                style={{ color: post.isLiked ? '#2563eb' : 'inherit', fontWeight: post.isLiked ? 700 : 500 }}
              >
                <ThumbsUp size={14} /> {post.likesCount || 0} Likes
              </button>
              <button
                className={`post-action-btn ${post.isBookmarked ? 'bookmarked' : ''}`}
                onClick={() => onBookmark(post.id)}
                style={{ color: post.isBookmarked ? '#f59e0b' : 'inherit' }}
              >
                Bookmark
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. Reports View
export function ReportsView({ dashboardData }) {
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dashboardData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'modvault-garage-report.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div>
          <h1 className="greeting-title">Fleet Reports & Compliance</h1>
          <p className="greeting-subtitle">Export PDF & JSON summaries for insurance verification and resale provenance.</p>
        </div>
        <button className="btn-primary" onClick={handleExport}>
          <Download size={16} /> Export Fleet Report
        </button>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Certified Garage History Available</h3>
        <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
          All recorded service timestamps, modification invoices, and fuel telemetry can be compiled into a tamper-evident maintenance portfolio.
        </p>
        <button className="btn-secondary" onClick={() => window.print()}>
          Print / PDF Statement
        </button>
      </div>
    </div>
  );
}
