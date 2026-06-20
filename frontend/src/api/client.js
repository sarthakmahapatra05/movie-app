import axios from 'axios';
import { store } from '../redux/store';

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const normalizedApiUrl = rawApiUrl.startsWith('http')
  ? rawApiUrl
  : `http://${rawApiUrl.replace(/^:\/?\/?/, '')}`;

const api = axios.create({
  baseURL: normalizedApiUrl
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
