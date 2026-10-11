import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, Car, Wrench, Fuel, DollarSign, Calculator, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

// 1. Add Vehicle Modal
export function AddVehicleModal({ isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: 2024,
    trim: 'Sport',
    registrationNumber: '',
    fuelType: 'Petrol',
    engineCapacity: '2.0 L Turbo',
    odometerKm: 5000,
    transmission: 'Automatic',
    isPrimary: false,
    statusBadge: 'Project',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createVehicle(formData);
      onRefresh();
      onClose();
    } catch (err) {
      alert('Error creating vehicle: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Car size={20} color="#2563eb" />
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>Add New Vehicle</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Make</label>
              <input
                required
                className="form-input"
                placeholder="e.g. Honda, BMW, Toyota"
                value={formData.make}
                onChange={(e) => setFormData({ ...formData, make: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Model</label>
              <input
                required
                className="form-input"
                placeholder="e.g. Civic, 330i, Supra"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Year</label>
              <input
                type="number"
                className="form-input"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || 2024 })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Trim</label>
              <input
                className="form-input"
                placeholder="e.g. M Sport, Type R"
                value={formData.trim}
                onChange={(e) => setFormData({ ...formData, trim: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Fuel Type</label>
              <select
                className="form-select"
                value={formData.fuelType}
                onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Hybrid</option>
                <option>Electric</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Registration Number</label>
              <input
                required
                className="form-input"
                placeholder="e.g. TS 09 AB 1234"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Engine Spec</label>
              <input
                className="form-input"
                placeholder="e.g. 2.0 L"
                value={formData.engineCapacity}
                onChange={(e) => setFormData({ ...formData, engineCapacity: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Odometer (km)</label>
              <input
                type="number"
                className="form-input"
                value={formData.odometerKm}
                onChange={(e) => setFormData({ ...formData, odometerKm: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Transmission</label>
              <select
                className="form-select"
                value={formData.transmission}
                onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
              >
                <option>Manual</option>
                <option>Automatic</option>
                <option>DCT</option>
                <option>CVT</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Garage Role / Badge</label>
              <select
                className="form-select"
                value={formData.statusBadge}
                onChange={(e) => setFormData({ ...formData, statusBadge: e.target.value })}
              >
                <option>Primary</option>
                <option>Secondary</option>
                <option>Project Build</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Vehicle Photo URL</label>
            <input
              className="form-input"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 2. Add Modification Modal
export function AddModificationModal({ isOpen, onClose, onRefresh, vehicles }) {
  const [formData, setFormData] = useState({
    partName: '',
    category: 'Performance',
    status: 'Planned',
    cost: 25000,
    vehicleId: vehicles?.[0]?.id || 1,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createModification({
        partName: formData.partName,
        category: formData.category,
        status: formData.status,
        cost: formData.cost,
        notes: formData.notes
      });
      onRefresh();
      onClose();
    } catch (err) {
      alert('Error adding modification: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wrench size={20} color="#2563eb" />
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>Add Modification</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Part / Upgrade Name</label>
            <input
              required
              className="form-input"
              placeholder="e.g. Borla Cat-back Exhaust, Brembo Big Brake Kit"
              value={formData.partName}
              onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Performance</option>
                <option>Suspension</option>
                <option>Wheels & Tyres</option>
                <option>Exhaust</option>
                <option>Exterior</option>
                <option>Interior</option>
                <option>Electronics</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Build Status</label>
              <select
                className="form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option>Installed</option>
                <option>Planned</option>
                <option>In Progress</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cost (₹)</label>
            <input
              type="number"
              required
              className="form-input"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Add Modification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 3. Log Maintenance Modal
export function LogMaintenanceModal({ isOpen, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    title: '',
    serviceDate: new Date().toISOString().split('T')[0],
    cost: 4500,
    odometerKm: 43000,
    serviceCenter: 'Authorized Center',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createLog(formData);
      onRefresh();
      onClose();
    } catch (err) {
      alert('Error recording log: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wrench size={20} color="#10b981" />
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>Log Maintenance</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Service Description</label>
            <input
              required
              className="form-input"
              placeholder="e.g. 40,000 km Periodic Service + Synthetic Oil Change"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Service Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.serviceDate}
                onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cost (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Odometer Reading (km)</label>
              <input
                type="number"
                className="form-input"
                value={formData.odometerKm}
                onChange={(e) => setFormData({ ...formData, odometerKm: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Service Center / Garage</label>
              <input
                className="form-input"
                value={formData.serviceCenter}
                onChange={(e) => setFormData({ ...formData, serviceCenter: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Record Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 4. Add Fuel / Expense Modal
export function AddFuelExpenseModal({ isOpen, onClose, onRefresh }) {
  const [tab, setTab] = useState('fuel');
  const [fuelData, setFuelData] = useState({
    cost: 2500,
    liters: 24.5,
    pricePerLiter: 102.04,
    fuelEconomyKmPerL: 13.5,
    odometerKm: 42800
  });
  const [expenseData, setExpenseData] = useState({
    title: '',
    category: 'Fuel',
    amount: 1500,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createFuelEntry({
        ...fuelData,
        entryDate: new Date().toISOString()
      });
      onRefresh();
      onClose();
    } catch (err) {
      alert('Error adding fuel entry: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createExpenseEntry({
        ...expenseData,
        expenseDate: new Date().toISOString()
      });
      onRefresh();
      onClose();
    } catch (err) {
      alert('Error adding expense: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {tab === 'fuel' ? <Fuel size={20} color="#2563eb" /> : <DollarSign size={20} color="#f59e0b" />}
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>Add Fuel / Expense Entry</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            type="button"
            className={`tab-btn ${tab === 'fuel' ? 'active' : ''}`}
            onClick={() => setTab('fuel')}
          >
            Fuel Entry
          </button>
          <button
            type="button"
            className={`tab-btn ${tab === 'expense' ? 'active' : ''}`}
            onClick={() => setTab('expense')}
          >
            General Expense
          </button>
        </div>

        {tab === 'fuel' ? (
          <form onSubmit={handleFuelSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Total Cost (₹)</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={fuelData.cost}
                  onChange={(e) => setFuelData({ ...fuelData, cost: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Liters Filled</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  className="form-input"
                  value={fuelData.liters}
                  onChange={(e) => setFuelData({ ...fuelData, liters: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Fuel Economy (km/l)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-input"
                  value={fuelData.fuelEconomyKmPerL}
                  onChange={(e) => setFuelData({ ...fuelData, fuelEconomyKmPerL: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Odometer (km)</label>
                <input
                  type="number"
                  className="form-input"
                  value={fuelData.odometerKm}
                  onChange={(e) => setFuelData({ ...fuelData, odometerKm: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Add Fuel Entry'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleExpenseSubmit}>
            <div className="form-group">
              <label className="form-label">Expense Title</label>
              <input
                required
                className="form-input"
                placeholder="e.g. Car Wash & Detailing, Fastag Tolls"
                value={expenseData.title}
                onChange={(e) => setExpenseData({ ...expenseData, title: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={expenseData.category}
                  onChange={(e) => setExpenseData({ ...expenseData, category: e.target.value })}
                >
                  <option>Fuel</option>
                  <option>Maintenance</option>
                  <option>Modifications</option>
                  <option>Insurance</option>
                  <option>Others</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={expenseData.amount}
                  onChange={(e) => setExpenseData({ ...expenseData, amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Add Expense'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// 5. Cost Calculator Modal
export function CostCalculatorModal({ isOpen, onClose }) {
  const [params, setParams] = useState({
    monthlyKm: 1200,
    fuelPrice: 105,
    mileageKmPerL: 12.5,
    insuranceYearly: 24000,
    plannedModificationsCost: 150000,
    yearsOfOwnership: 5
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const res = await api.calculateCost(params);
      setResult(res);
    } catch (err) {
      alert('Error calculating: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: 620 }}>
        <div className="modal-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Calculator size={20} color="#2563eb" />
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>Garage Build & Running Cost Calculator</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Monthly Distance (km): {params.monthlyKm}</label>
            <input
              type="range"
              min="200"
              max="4000"
              step="50"
              value={params.monthlyKm}
              onChange={(e) => setParams({ ...params, monthlyKm: parseInt(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fuel Price (₹ / liter)</label>
            <input
              type="number"
              className="form-input"
              value={params.fuelPrice}
              onChange={(e) => setParams({ ...params, fuelPrice: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Fuel Mileage (km / L)</label>
            <input
              type="number"
              step="0.5"
              className="form-input"
              value={params.mileageKmPerL}
              onChange={(e) => setParams({ ...params, mileageKmPerL: parseFloat(e.target.value) || 1 })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Annual Insurance (₹)</label>
            <input
              type="number"
              className="form-input"
              value={params.insuranceYearly}
              onChange={(e) => setParams({ ...params, insuranceYearly: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Planned Mods Budget (₹)</label>
            <input
              type="number"
              className="form-input"
              value={params.plannedModificationsCost}
              onChange={(e) => setParams({ ...params, plannedModificationsCost: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Ownership Period (Years)</label>
            <input
              type="number"
              className="form-input"
              value={params.yearsOfOwnership}
              onChange={(e) => setParams({ ...params, yearsOfOwnership: parseInt(e.target.value) || 1 })}
            />
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{ width: '100%', marginTop: 8 }}
          onClick={handleCalculate}
          disabled={loading}
        >
          {loading ? 'Calculating...' : 'Run Financial Projection'}
        </button>

        {result && (
          <div style={{ marginTop: 18, background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#0f172a' }}>Calculated Projections</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: 13 }}>
              <div>
                <span style={{ color: '#64748b' }}>Monthly Fuel: </span>
                <strong>₹ {result.monthlyFuelCost}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Running Cost/km: </span>
                <strong style={{ color: '#2563eb' }}>₹ {result.costPerKm}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Monthly Maintenance: </span>
                <strong>₹ {result.monthlyMaintenanceEstimate}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Total Monthly: </span>
                <strong>₹ {result.totalMonthlyRunningCost}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Annual Total: </span>
                <strong>₹ {result.annualTotalCost}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>{params.yearsOfOwnership}-Year Total + Mods: </span>
                <strong style={{ color: '#10b981' }}>₹ {result.totalCostOverOwnership}</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 6. Compatibility Checker Modal
export function CompatibilityCheckerModal({ isOpen, onClose }) {
  const [params, setParams] = useState({
    make: 'Honda',
    model: 'Civic',
    year: 2019,
    partCategory: 'Performance',
    partName: 'Cold Air Intake'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheck = async () => {
    setLoading(true);
    try {
      const res = await api.checkCompatibility(params);
      setResult(res);
    } catch (err) {
      alert('Error verifying compatibility: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: 560 }}>
        <div className="modal-title-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShieldCheck size={20} color="#10b981" />
            <h3 style={{ fontSize: 17, fontWeight: 700 }}>Part & Vehicle Compatibility Checker</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          <div className="form-group">
            <label className="form-label">Vehicle Make</label>
            <input
              className="form-input"
              value={params.make}
              onChange={(e) => setParams({ ...params, make: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Model</label>
            <input
              className="form-input"
              value={params.model}
              onChange={(e) => setParams({ ...params, model: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Year</label>
            <input
              type="number"
              className="form-input"
              value={params.year}
              onChange={(e) => setParams({ ...params, year: parseInt(e.target.value) || 2020 })}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Mod Part Name</label>
          <input
            className="form-input"
            placeholder="e.g. HKS Cat-back Exhaust, BC Racing Coilovers"
            value={params.partName}
            onChange={(e) => setParams({ ...params, partName: e.target.value })}
          />
        </div>

        <button
          type="button"
          className="btn-primary"
          style={{ width: '100%', marginTop: 8 }}
          onClick={handleCheck}
          disabled={loading}
        >
          {loading ? 'Verifying...' : 'Validate Fitment & Clearances'}
        </button>

        {result && (
          <div style={{ marginTop: 18, background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 color="#10b981" size={18} />
                <strong style={{ fontSize: 14 }}>{result.status}</strong>
              </div>
              <span className="tag-badge emerald">{result.fitmentScore} Match</span>
            </div>
            <p style={{ fontSize: 12.5, color: '#475569', marginBottom: 10 }}>{result.notes}</p>
            {result.requiredAccessories?.length > 0 && (
              <div style={{ fontSize: 12, color: '#64748b' }}>
                <strong>Required Accessories:</strong> {result.requiredAccessories.join(', ')}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 7. Build Comparison Modal
export function BuildComparisonModal({ isOpen, onClose, comparisonData }) {
  if (!isOpen) return null;

  const stock = comparisonData?.stock || {
    name: 'Civic (Stock)',
    totalCost: '₹ 18.5 L',
    averageMileage: '12.5 km/l',
    power: '141 hp',
    torque: '174 Nm',
    suspension: 'OEM Struts',
    exhaust: 'Factory Twin Resonator',
    imageUrl: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80'
  };

  const modified = comparisonData?.modified || {
    name: 'Civic (Modified)',
    totalCost: '₹ 24.8 L',
    averageMileage: '11.2 km/l',
    power: '215 hp (Stage 2)',
    torque: '290 Nm',
    suspension: 'BC Racing Coilovers (32-way)',
    exhaust: 'Full Cat-back Stainless Steel',
    imageUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80'
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ width: 680 }}>
        <div className="modal-title-row">
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>Build Comparison: Stock vs Modified</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#64748b" />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Stock column */}
          <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
            <img src={stock.imageUrl} alt={stock.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{stock.name}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: '#475569' }}>
                <div><strong>Total Investment:</strong> {stock.totalCost}</div>
                <div><strong>Avg Mileage:</strong> {stock.averageMileage}</div>
                <div><strong>Power Output:</strong> {stock.power || '141 hp'}</div>
                <div><strong>Suspension:</strong> {stock.suspension || 'OEM'}</div>
                <div><strong>Exhaust:</strong> {stock.exhaust || 'Factory'}</div>
              </div>
            </div>
          </div>

          {/* Modified column */}
          <div style={{ border: '2px solid #2563eb', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
            <img src={modified.imageUrl} alt={modified.name} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
            <div style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{modified.name}</span>
                <span className="tag-badge blue">Tuned</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12.5, color: '#475569' }}>
                <div><strong>Total Investment:</strong> <span style={{ color: '#2563eb', fontWeight: 700 }}>{modified.totalCost}</span></div>
                <div><strong>Avg Mileage:</strong> {modified.averageMileage}</div>
                <div><strong>Power Output:</strong> {modified.power || '215 hp'}</div>
                <div><strong>Suspension:</strong> {modified.suspension}</div>
                <div><strong>Exhaust:</strong> {modified.exhaust}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
          <button className="btn-primary" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}
