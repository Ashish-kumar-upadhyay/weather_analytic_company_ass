import api from './api';

export const adminApi = {
  getUsers: () => api.get('/admin/users'),
  getUserQuota: (id) => api.get(`/admin/users/${id}/quota`),
  updateUserLimit: (id, dailyLimit) => api.put(`/admin/users/${id}/limit`, { daily_limit: dailyLimit }),
  getQuotaStats: () => api.get('/admin/quota-stats'),
  getQuotaPool: () => api.get('/admin/quota-pool'),
  getConfig: () => api.get('/admin/config'),
  updateConfig: (key, value) => api.put('/admin/config', { key, value }),
};
