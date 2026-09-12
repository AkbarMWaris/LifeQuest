import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });

let accessToken = localStorage.getItem('lq_access') || null;
let refreshToken = localStorage.getItem('lq_refresh') || null;

export function setTokens(access, refresh) {
  accessToken = access || null;
  refreshToken = refresh || null;
  if (access) localStorage.setItem('lq_access', access);
  else localStorage.removeItem('lq_access');
  if (refresh) localStorage.setItem('lq_refresh', refresh);
  else localStorage.removeItem('lq_refresh');
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('lq_access');
  localStorage.removeItem('lq_refresh');
}

export function getAccessToken() {
  return accessToken;
}

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retried && refreshToken) {
      original._retried = true;
      refreshing =
        refreshing ||
        (async () => {
          const { data } = await axios.post('/api/auth/refresh', { refreshToken });
          setTokens(data.accessToken, data.refreshToken);
          return data.accessToken;
        })();
      try {
        const token = await refreshing;
        refreshing = null;
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      } catch (e) {
        refreshing = null;
        clearTokens();
        window.dispatchEvent(new Event('lq:logout'));
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export function errorMessage(err, fallback = 'Something went wrong in the realm.') {
  return err?.response?.data?.error || err?.message || fallback;
}