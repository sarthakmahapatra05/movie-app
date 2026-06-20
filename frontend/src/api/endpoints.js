import api from './client';

export const authApi = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data)
};

export const movieApi = {
  getAll: (status) => api.get('/movies', { params: status ? { status } : {} }),
  getById: (id) => api.get(`/movies/${id}`)
};

export const theatreApi = {
  getAll: () => api.get('/theatres')
};

export const showtimeApi = {
  getAll: (params) => api.get('/showtimes', { params }),
  getById: (id) => api.get(`/showtimes/${id}`)
};

export const bookingApi = {
  create: (data) => api.post('/bookings', data),
  getMine: () => api.get('/bookings/me'),
  cancel: (id) => api.post(`/bookings/${id}/cancel`)
};
