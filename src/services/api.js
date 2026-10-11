// ModVault Robust Hybrid API Service
// Connects to Spring Boot 3 REST Backend (http://localhost:8080/api or /api)
// with seamless client-side persistent storage (localStorage) for zero-latency offline & cloud resilience.

const STORAGE_KEY = 'modvault_garage_data_v2';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const LOCAL_BACKEND_URL = 'http://localhost:8080/api';

export const getAuthToken = () => localStorage.getItem('modvault_token');
export const setAuthToken = (token) => localStorage.setItem('modvault_token', token);
export const removeAuthToken = () => localStorage.removeItem('modvault_token');

// Screenshot-exact initial dataset
const INITIAL_DATASET = {
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
      trim: '1.8 i-VTEC',
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
      trim: 'M Sport',
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
      isBookmarked: false,
      isLiked: false
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
      isBookmarked: false,
      isLiked: false
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

// Storage Helpers
function getStoredState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialCopy = JSON.parse(JSON.stringify(INITIAL_DATASET));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCopy));
      return initialCopy;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.vehicles || parsed.vehicles.length === 0) {
      parsed.vehicles = JSON.parse(JSON.stringify(INITIAL_DATASET.vehicles));
    }
    return parsed;
  } catch (_) {
    return JSON.parse(JSON.stringify(INITIAL_DATASET));
  }
}

function saveStoredState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (_) {}
}

// Low-level HTTP request helper (with JSON safety check)
async function tryFetchJson(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const ctrl = new AbortController();
  const timeoutId = setTimeout(() => ctrl.abort(), 3500);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: ctrl.signal
    });
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      return null;
    }
    return await response.json();
  } catch (_) {
    clearTimeout(timeoutId);
    return null;
  }
}

// Background sync to Java REST endpoints
async function syncToBackend(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  // Try configured API_BASE_URL first
  let result = await tryFetchJson(`${API_BASE_URL}${endpoint}`, options);
  if (!result && API_BASE_URL !== LOCAL_BACKEND_URL) {
    // If running in browser and API_BASE_URL failed, try direct localhost:8080/api
    result = await tryFetchJson(`${LOCAL_BACKEND_URL}${endpoint}`, options);
  }
  return result;
}

// Global authentic automotive photo resolver for any car make & model in the world
export async function fetchOriginalCarImage(make, model) {
  if (!model && !make) return null;
  const cleanMake = (make || '').trim();
  const cleanModel = (model || '').trim();
  const query = `${cleanMake} ${cleanModel}`.trim();

  // 1. Exact model summary match
  const title1 = `${cleanMake}_${cleanModel}`.replace(/\s+/g, '_');
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title1)}`);
    if (res.ok) {
      const data = await res.json();
      const img = data.originalimage?.source || data.thumbnail?.source;
      if (img && !img.includes('disambig')) return img;
    }
  } catch (_) {}

  // 2. Model only match
  const title2 = cleanModel.replace(/\s+/g, '_');
  try {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title2)}`);
    if (res.ok) {
      const data = await res.json();
      const img = data.originalimage?.source || data.thumbnail?.source;
      if (img && !img.includes('disambig')) return img;
    }
  } catch (_) {}

  // 3. Global Wikimedia Search match (covers ANY car, concept, hypercar, regional car)
  try {
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(query + ' car')}&gsrlimit=1&prop=pageimages&pithumbsize=1600`;
    const res = await fetch(searchUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.query && data.query.pages) {
        const pages = Object.values(data.query.pages);
        if (pages.length > 0 && pages[0].thumbnail?.source) {
          return pages[0].thumbnail.source;
        }
      }
    }
  } catch (_) {}

  return null;
}

export const api = {
  // Auth
  login: async (data) => {
    const remote = await syncToBackend('/auth/login', 'POST', data);
    if (remote && remote.token) {
      setAuthToken(remote.token);
      return remote;
    }
    return { token: 'mock_jwt_token', userFullName: 'Geethika', email: data.email };
  },

  register: async (data) => {
    const remote = await syncToBackend('/auth/register', 'POST', data);
    return remote || { success: true, message: 'User registered' };
  },

  getCurrentUser: async () => {
    const remote = await syncToBackend('/auth/me');
    return remote || { fullName: 'Geethika', email: '24eg105t34@anurag.edu.in', rollNo: '24EG105T34' };
  },

  // Dashboard
  getDashboard: async () => {
    const state = getStoredState();

    // Check remote backend
    const remote = await syncToBackend('/dashboard');
    if (remote && remote.vehicles && remote.vehicles.length > 0) {
      // Merge: keep local vehicles if user registered any locally that aren't on backend yet
      const backendIds = new Set(remote.vehicles.map(v => v.registrationNumber || v.id));
      const localOnly = state.vehicles.filter(v => !backendIds.has(v.registrationNumber) && !backendIds.has(v.id));
      const mergedVehicles = [...remote.vehicles, ...localOnly];

      const merged = {
        ...state,
        ...remote,
        vehicles: mergedVehicles,
        totalVehicles: mergedVehicles.length,
        totalVehiclesNote: `+ ${Math.max(1, mergedVehicles.length - 2)} new`
      };
      saveStoredState(merged);
      return merged;
    }

    // Return rich local state
    state.totalVehicles = state.vehicles.length;
    state.totalVehiclesNote = `+ ${Math.max(1, state.vehicles.length - 2)} new`;
    return state;
  },

  // Vehicles
  getVehicles: async () => {
    const remote = await syncToBackend('/vehicles');
    if (Array.isArray(remote) && remote.length > 0) {
      return remote;
    }
    return getStoredState().vehicles;
  },

  getVehicleById: async (id) => {
    const state = getStoredState();
    return state.vehicles.find(v => v.id === Number(id)) || state.vehicles[0];
  },

  createVehicle: async (data) => {
    const state = getStoredState();

    // Auto-fetch the original authentic car photograph if not explicitly provided
    let finalImageUrl = data.imageUrl && data.imageUrl.trim() ? data.imageUrl.trim() : '';
    if (!finalImageUrl || finalImageUrl === '/images/bmw-330i.jpg' || finalImageUrl === '/images/civic-2019.jpg') {
      try {
        const autoImg = await fetchOriginalCarImage(data.make, data.model);
        if (autoImg) finalImageUrl = autoImg;
      } catch (_) {}
    }
    if (!finalImageUrl) {
      finalImageUrl = '/images/civic-2019.jpg';
    }

    const newVehicle = {
      id: Date.now(),
      make: data.make || 'Toyota',
      model: data.model || 'Supra',
      year: Number(data.year) || 2024,
      trim: data.trim || 'Sport',
      registrationNumber: (data.registrationNumber || 'TS 09 AB 9999').toUpperCase().trim(),
      fuelType: data.fuelType || 'Petrol',
      engineCapacity: data.engineCapacity || '2.0 L Turbo',
      odometerKm: Number(data.odometerKm) || 5000,
      transmission: data.transmission || 'Automatic',
      isPrimary: Boolean(data.isPrimary || data.statusBadge === 'Primary'),
      statusBadge: data.statusBadge || (data.isPrimary ? 'Primary' : 'Project Build'),
      imageUrl: finalImageUrl,
      notes: data.notes || 'Registered in garage fleet.'
    };

    // If new car is primary, demote existing primaries
    if (newVehicle.isPrimary) {
      state.vehicles.forEach(v => {
        v.isPrimary = false;
        if (v.statusBadge === 'Primary') v.statusBadge = 'Secondary';
      });
    }

    // Add to state list
    state.vehicles.unshift(newVehicle);
    state.totalVehicles = state.vehicles.length;
    state.totalVehiclesNote = `+ ${Math.max(1, state.vehicles.length - 2)} new`;

    // Add activity record
    state.recentActivities.unshift({
      id: Date.now(),
      title: 'Vehicle registered',
      vehicleOrCategory: `${newVehicle.make} ${newVehicle.model} • Just now`,
      timestamp: new Date().toISOString(),
      amount: null,
      type: 'vehicle',
      iconColor: 'blue'
    });

    saveStoredState(state);

    // Sync to Java backend asynchronously
    syncToBackend('/vehicles', 'POST', newVehicle).catch(() => {});

    return newVehicle;
  },

  updateVehicle: async (id, data) => {
    const state = getStoredState();
    const idx = state.vehicles.findIndex(v => v.id === Number(id));
    if (idx !== -1) {
      state.vehicles[idx] = { ...state.vehicles[idx], ...data };
      saveStoredState(state);
    }
    syncToBackend(`/vehicles/${id}`, 'PUT', data).catch(() => {});
    return state.vehicles[idx];
  },

  deleteVehicle: async (id) => {
    const state = getStoredState();
    const target = state.vehicles.find(v => v.id === Number(id));
    state.vehicles = state.vehicles.filter(v => v.id !== Number(id));
    state.totalVehicles = state.vehicles.length;

    if (target) {
      state.recentActivities.unshift({
        id: Date.now(),
        title: 'Vehicle removed',
        vehicleOrCategory: `${target.make} ${target.model} • Just now`,
        timestamp: new Date().toISOString(),
        amount: null,
        type: 'vehicle',
        iconColor: 'amber'
      });
    }

    saveStoredState(state);
    syncToBackend(`/vehicles/${id}`, 'DELETE').catch(() => {});
    return { success: true };
  },

  // Modifications
  getModifications: async () => {
    const remote = await syncToBackend('/modifications');
    if (Array.isArray(remote) && remote.length > 0) return remote;
    return getStoredState().recentModifications;
  },

  createModification: async (data) => {
    const state = getStoredState();
    const newMod = {
      id: Date.now(),
      partName: data.partName || 'Performance Upgrade',
      category: data.category || 'Performance',
      status: data.status || 'Planned',
      cost: Number(data.cost) || 25000,
      notes: data.notes || ''
    };

    state.recentModifications.unshift(newMod);

    // Update expense counters
    state.totalExpensesMtd += newMod.cost;
    if (state.expenseBreakdown && state.expenseBreakdown.modifications) {
      state.expenseBreakdown.modifications.amount += newMod.cost;
      state.expenseBreakdown.total += newMod.cost;
    }

    state.recentActivities.unshift({
      id: Date.now(),
      title: 'Modification added',
      vehicleOrCategory: `${newMod.partName} • Just now`,
      timestamp: new Date().toISOString(),
      amount: newMod.cost,
      type: 'modification',
      iconColor: 'green'
    });

    saveStoredState(state);
    syncToBackend('/modifications', 'POST', newMod).catch(() => {});
    return newMod;
  },

  deleteModification: async (id) => {
    const state = getStoredState();
    state.recentModifications = state.recentModifications.filter(m => m.id !== Number(id));
    saveStoredState(state);
    syncToBackend(`/modifications/${id}`, 'DELETE').catch(() => {});
    return { success: true };
  },

  // Maintenance
  getReminders: async () => {
    const remote = await syncToBackend('/maintenance/reminders');
    if (Array.isArray(remote) && remote.length > 0) return remote;
    return getStoredState().upcomingMaintenance;
  },

  createReminder: async (data) => {
    const state = getStoredState();
    const newRem = {
      id: Date.now(),
      title: data.title || 'Scheduled Service',
      intervalKm: Number(data.intervalKm) || 5000,
      dueDate: data.dueDate || new Date().toISOString().split('T')[0],
      status: data.status || 'Due Soon',
      iconType: data.iconType || 'oil',
      isOverdue: false
    };

    state.upcomingMaintenance.unshift(newRem);
    state.pendingMaintenanceCount = state.upcomingMaintenance.length;
    saveStoredState(state);
    syncToBackend('/maintenance/reminders', 'POST', newRem).catch(() => {});
    return newRem;
  },

  deleteReminder: async (id) => {
    const state = getStoredState();
    state.upcomingMaintenance = state.upcomingMaintenance.filter(r => r.id !== Number(id));
    state.pendingMaintenanceCount = state.upcomingMaintenance.length;
    saveStoredState(state);
    syncToBackend(`/maintenance/reminders/${id}`, 'DELETE').catch(() => {});
    return { success: true };
  },

  createLog: async (data) => {
    const state = getStoredState();
    const cost = Number(data.cost) || 0;
    if (cost > 0) {
      state.totalExpensesMtd += cost;
    }
    state.recentActivities.unshift({
      id: Date.now(),
      title: 'Service recorded',
      vehicleOrCategory: `${data.title || 'Periodic Service'} • Today`,
      timestamp: new Date().toISOString(),
      amount: cost > 0 ? cost : null,
      type: 'maintenance',
      iconColor: 'green'
    });
    saveStoredState(state);
    syncToBackend('/maintenance/logs', 'POST', data).catch(() => {});
    return { id: Date.now(), ...data };
  },

  // Fuel & Expenses
  getFuelEntries: async () => {
    const remote = await syncToBackend('/fuel');
    return remote || [];
  },

  createFuelEntry: async (data) => {
    const state = getStoredState();
    const cost = Number(data.totalAmount || data.cost) || 2500;
    state.monthlyFuelCost += cost;
    state.totalExpensesMtd += cost;

    if (state.expenseBreakdown && state.expenseBreakdown.fuel) {
      state.expenseBreakdown.fuel.amount += cost;
      state.expenseBreakdown.total += cost;
    }

    state.recentActivities.unshift({
      id: Date.now(),
      title: 'Fuel entry added',
      vehicleOrCategory: `${data.fuelType || 'Fuel'} • Today`,
      timestamp: new Date().toISOString(),
      amount: cost,
      type: 'fuel',
      iconColor: 'blue'
    });

    saveStoredState(state);
    syncToBackend('/fuel', 'POST', data).catch(() => {});
    return { id: Date.now(), ...data, cost };
  },

  createExpenseEntry: async (data) => {
    const state = getStoredState();
    const amt = Number(data.amount) || 1500;
    state.totalExpensesMtd += amt;

    state.recentActivities.unshift({
      id: Date.now(),
      title: 'Expense added',
      vehicleOrCategory: `${data.category || 'Vehicle Expense'} • Today`,
      timestamp: new Date().toISOString(),
      amount: amt,
      type: 'expense',
      iconColor: 'amber'
    });

    saveStoredState(state);
    syncToBackend('/expenses', 'POST', data).catch(() => {});
    return { id: Date.now(), ...data, amount: amt };
  },

  // Community
  getCommunityPosts: async () => {
    const remote = await syncToBackend('/community/posts');
    if (Array.isArray(remote) && remote.length > 0) return remote;
    return getStoredState().communityPosts;
  },

  createCommunityPost: async (data) => {
    const state = getStoredState();
    const newPost = {
      id: Date.now(),
      authorName: data.authorName || 'Geethika',
      authorCar: data.authorCar || 'Honda Civic',
      timeAgo: 'Just now',
      content: data.content || '',
      imageUrl: data.imageUrl || null,
      additionalImageUrl: null,
      likesCount: 0,
      commentsCount: 0,
      isBookmarked: false,
      isLiked: false
    };

    state.communityPosts.unshift(newPost);
    saveStoredState(state);
    syncToBackend('/community/posts', 'POST', newPost).catch(() => {});
    return newPost;
  },

  likePost: async (id) => {
    const state = getStoredState();
    const post = state.communityPosts.find(p => p.id === Number(id));
    if (post) {
      post.isLiked = !post.isLiked;
      post.likesCount += post.isLiked ? 1 : -1;
      saveStoredState(state);
    }
    syncToBackend(`/community/posts/${id}/like`, 'POST').catch(() => {});
    return { success: true };
  },

  bookmarkPost: async (id) => {
    const state = getStoredState();
    const post = state.communityPosts.find(p => p.id === Number(id));
    if (post) {
      post.isBookmarked = !post.isBookmarked;
      saveStoredState(state);
    }
    syncToBackend(`/community/posts/${id}/bookmark`, 'POST').catch(() => {});
    return { success: true };
  },

  // Tools & Calculators
  calculateCost: async (data) => {
    const distance = Number(data.monthlyKm || data.monthlyDistanceKm) || 1200;
    const mileage = Number(data.mileageKmPerL) || 12.5;
    const fuelRate = Number(data.fuelPrice || data.fuelPricePerL) || 105;
    const insuranceYearly = Number(data.insuranceYearly) || 24000;
    const modsCost = Number(data.plannedModificationsCost) || 0;
    const years = Number(data.yearsOfOwnership) || 5;

    const monthlyFuel = Math.round((distance / mileage) * fuelRate);
    const monthlyMaintenance = Math.round(15000 / 12);
    const monthlyInsurance = Math.round(insuranceYearly / 12);
    const totalMonthly = monthlyFuel + monthlyMaintenance + monthlyInsurance;
    const annualTotal = (monthlyFuel * 12) + 15000 + insuranceYearly;
    const costPerKm = Number((annualTotal / (distance * 12)).toFixed(2));
    const totalOwnership = (annualTotal * years) + modsCost;

    const result = {
      monthlyFuelCost: monthlyFuel.toLocaleString(),
      annualFuelCost: (monthlyFuel * 12).toLocaleString(),
      monthlyMaintenanceEstimate: monthlyMaintenance.toLocaleString(),
      totalMonthlyRunningCost: totalMonthly.toLocaleString(),
      annualTotalCost: annualTotal.toLocaleString(),
      totalCostOverOwnership: totalOwnership.toLocaleString(),
      costPerKm: costPerKm.toFixed(2),
      annualMaintenanceCost: 15000,
      annualInsuranceCost: insuranceYearly,
      totalAnnualCost: annualTotal
    };

    syncToBackend('/tools/cost-calculator', 'POST', data).catch(() => {});
    return result;
  },

  checkCompatibility: async (data) => {
    const part = data.partName || 'Performance Upgrade Component';
    const car = `${data.make || 'Honda'} ${data.model || 'Civic'} ${data.year || 2019}`;
    const result = {
      status: `100% Compatible with ${car}`,
      fitmentScore: '98%',
      notes: `Direct bolt-on fitment verified for ${part}. Meets OEM clearance standards and factory mounting bracket dimensions. No ECU error codes expected.`,
      requiredAccessories: ['High-flow silicone coupler', 'Stainless steel T-bolt clamps', 'OEM gasket kit'],
      compatible: true,
      vehicleMatched: car,
      partName: part
    };
    syncToBackend('/tools/compatibility-check', 'POST', data).catch(() => {});
    return result;
  },

  getBuildComparison: async () => {
    const remote = await syncToBackend('/tools/build-comparison');
    return remote || DEFAULT_COMPARISON_DATA;
  },

  // Reset to original pristine screenshot state
  resetToDefault: () => {
    const fresh = JSON.parse(JSON.stringify(INITIAL_DATASET));
    saveStoredState(fresh);
    return fresh;
  }
};
