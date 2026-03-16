import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const playerApi = {
  getAll: () => api.get('/players').then(r => r.data),
  getById: (id) => api.get(`/players/${id}`).then(r => r.data),
  create: (data) => api.post('/players', data).then(r => r.data),
  update: (id, data) => api.put(`/players/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/players/${id}`),
};

export const courseApi = {
  getAll: (location) => api.get('/courses', { params: { location } }).then(r => r.data),
  getById: (id) => api.get(`/courses/${id}`).then(r => r.data),
  create: (data) => api.post('/courses', data).then(r => r.data),
  update: (id, data) => api.put(`/courses/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const bookingApi = {
  getByPlayer: (playerId) => api.get(`/bookings/player/${playerId}`).then(r => r.data),
  getByCourseAndDate: (courseId, date) =>
    api.get(`/bookings/course/${courseId}`, { params: { date } }).then(r => r.data),
  create: (data) => api.post('/bookings', data).then(r => r.data),
  cancel: (id) => api.post(`/bookings/${id}/cancel`).then(r => r.data),
  delete: (id) => api.delete(`/bookings/${id}`),
};

export const roundApi = {
  getByPlayer: (playerId) => api.get(`/players/${playerId}/rounds`).then(r => r.data),
  getById: (id) => api.get(`/rounds/${id}`).then(r => r.data),
  create: (data) => api.post('/rounds', data).then(r => r.data),
  addScore: (roundId, score) => api.post(`/rounds/${roundId}/scores`, score).then(r => r.data),
  complete: (id) => api.post(`/rounds/${id}/complete`).then(r => r.data),
};
