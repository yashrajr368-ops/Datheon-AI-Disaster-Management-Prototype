import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach authorization token if present in localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('datheon_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Dashboard APIs
export const getDashboardStats = () => api.get('/dashboard/stats');
export const getRiskDistribution = () => api.get('/dashboard/risk-distribution');
export const getHistoricalTrends = () => api.get('/dashboard/historical-trends');
export const getDashboardAlerts = () => api.get('/dashboard/alerts');
export const getRecentActivity = () => api.get('/dashboard/recent-activity');

// Locations APIs
export const getLocations = (category = null, search = '') => {
  const params = {};
  if (category && category !== 'All') params.category = category;
  if (search) params.search = search;
  return api.get('/locations', { params });
};
export const getLocationDetails = (id) => api.get(`/locations/${id}`);
export const createLocation = (data) => api.post('/locations', data);
export const updateLocation = (id, data) => api.put(`/locations/${id}`, data);
export const deleteLocation = (id) => api.delete(`/locations/${id}`);

// Risk Analysis APIs
export const evaluateRisk = (indicators) => api.post('/risk/evaluate', indicators);
export const getRecentAssessments = () => api.get('/risk/recent-assessments');

// Shelters APIs
export const getShelters = (district = null, status = null, search = '') => {
  const params = {};
  if (district && district !== 'All') params.district = district;
  if (status && status !== 'All') params.status = status;
  if (search) params.search = search;
  return api.get('/shelters', { params });
};
export const getShelterDetails = (id) => api.get(`/shelters/${id}`);
export const createShelter = (data) => api.post('/shelters', data);
export const updateShelter = (id, data) => api.put(`/shelters/${id}`, data);
export const deleteShelter = (id) => api.delete(`/shelters/${id}`);

// Route APIs
export const demonstrateRoute = (routeData) => api.post('/routes/demonstrate', routeData);

// Chat AI APIs
export const sendChatMessage = (message, history = [], locationContext = null) =>
  api.post('/chat', { message, history, location_context: locationContext });

// Admin APIs
export const loginAdmin = (username, password) =>
  api.post('/admin/login', { username, password });
export const getAdminMe = () => api.get('/admin/me');
export const getAdminLogs = () => api.get('/admin/logs');

// Report Generation APIs
export const generateReport = (indicators) => api.post('/reports/generate', indicators);

export default api;
