const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const getAuthToken = () => localStorage.getItem('modvault_token');
export const setAuthToken = (token) => localStorage.setItem('modvault_token', token);
export const removeAuthToken = () => localStorage.removeItem('modvault_token');

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    let errorMsg = `HTTP Error ${response.status}`;
    try {
      const errData = await response.json();
      errorMsg = errData.message || errorMsg;
    } catch (_) {}
    throw new Error(errorMsg);
  }

  // If 204 or empty
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // Auth
  login: (data) => request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getCurrentUser: () => request('/auth/me'),

  // Dashboard
  getDashboard: () => request('/dashboard'),

  // Vehicles
  getVehicles: () => request('/vehicles'),
  getVehicleById: (id) => request(`/vehicles/${id}`),
  createVehicle: (data) => request('/vehicles', { method: 'POST', body: JSON.stringify(data) }),
  updateVehicle: (id, data) => request(`/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteVehicle: (id) => request(`/vehicles/${id}`, { method: 'DELETE' }),

  // Modifications
  getModifications: () => request('/modifications'),
  createModification: (data) => request('/modifications', { method: 'POST', body: JSON.stringify(data) }),
  updateModification: (id, data) => request(`/modifications/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteModification: (id) => request(`/modifications/${id}`, { method: 'DELETE' }),

  // Maintenance
  getReminders: () => request('/maintenance/reminders'),
  createReminder: (data) => request('/maintenance/reminders', { method: 'POST', body: JSON.stringify(data) }),
  updateReminder: (id, data) => request(`/maintenance/reminders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteReminder: (id) => request(`/maintenance/reminders/${id}`, { method: 'DELETE' }),
  getLogs: () => request('/maintenance/logs'),
  createLog: (data) => request('/maintenance/logs', { method: 'POST', body: JSON.stringify(data) }),

  // Fuel & Expenses
  getFuelEntries: () => request('/fuel'),
  createFuelEntry: (data) => request('/fuel', { method: 'POST', body: JSON.stringify(data) }),
  getExpenseEntries: () => request('/expenses'),
  createExpenseEntry: (data) => request('/expenses', { method: 'POST', body: JSON.stringify(data) }),

  // Community
  getCommunityPosts: () => request('/community/posts'),
  createCommunityPost: (data) => request('/community/posts', { method: 'POST', body: JSON.stringify(data) }),
  likePost: (id) => request(`/community/posts/${id}/like`, { method: 'POST' }),
  bookmarkPost: (id) => request(`/community/posts/${id}/bookmark`, { method: 'POST' }),

  // Tools
  calculateCost: (data) => request('/tools/cost-calculator', { method: 'POST', body: JSON.stringify(data) }),
  checkCompatibility: (data) => request('/tools/compatibility-check', { method: 'POST', body: JSON.stringify(data) }),
  getBuildComparison: () => request('/tools/build-comparison'),
  getBuildPlans: () => request('/tools/build-plans'),
  createBuildPlan: (data) => request('/tools/build-plans', { method: 'POST', body: JSON.stringify(data) })
};
