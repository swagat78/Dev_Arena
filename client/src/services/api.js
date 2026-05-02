const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const parseJson = async (response) => {
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

const request = async (endpoint, options = {}) => {
  const { token, ...restOptions } = options;

  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(restOptions.headers || {}),
      },
    });
  } catch (networkError) {
    throw new Error(`Unable to reach server. Please ensure backend is running on ${API_URL.replace('/api', '')}`);
  }

  const data = await parseJson(response);

  if (!response.ok) {
    const error = new Error(data.message || 'Request failed');
    error.status = response.status;
    throw error;
  }

  return data;
};

export const authApi = {
  register: (payload) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  login: (payload) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  forgotPassword: (payload) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  me: (token) => request('/auth/me', { token }),
  updateProfile: (payload, token) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
      token,
    }),
};

export const userApi = {
  getProfile: (token) => request('/user/profile', { token }),
};

export const projectApi = {
  getAll: (token) => request('/projects', { token }),
  create: (payload, token) =>
    request('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  update: (id, payload, token) =>
    request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      token,
    }),
  remove: (id, token) =>
    request(`/projects/${id}`, {
      method: 'DELETE',
      token,
    }),
};

export const interviewApi = {
  getAll: (token) => request('/interviews', { token }),
  create: (payload, token) =>
    request('/interviews', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  getByRoomId: (roomId, token) => request(`/interviews/room/${roomId}`, { token }),
  updateStatus: (id, status, token) =>
    request(`/interviews/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      token,
    }),
  saveCode: (id, payload, token) =>
    request(`/interviews/${id}/code`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
      token,
    }),
};

export const problemApi = {
  getAll: (token, params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set('search', params.search);
    if (params.difficulty) searchParams.set('difficulty', params.difficulty);
    if (params.tag) searchParams.set('tag', params.tag);

    const query = searchParams.toString();
    return request(`/problems${query ? `?${query}` : ''}`, { token });
  },
  getBySlug: (slug, token) => request(`/problems/slug/${slug}`, { token }),
};

export const submissionApi = {
  create: (payload, token) =>
    request('/submissions', {
      method: 'POST',
      body: JSON.stringify(payload),
      token,
    }),
  getMine: (token, problemId) => {
    const query = problemId ? `?problemId=${problemId}` : '';
    return request(`/submissions${query}`, { token });
  },
  getRecent: (token) => request('/submissions/recent', { token }),
};

export const contestApi = {
  getAll: (token) => request('/contests', { token }),
  getBySlug: (slug, token) => request(`/contests/${slug}`, { token }),
};

export const notificationApi = {
  getAll: (token) => request('/notifications', { token }),
  markAsRead: (id, token) => request(`/notifications/${id}/read`, { method: 'PATCH', token }),
  markAllAsRead: (token) => request('/notifications/read-all', { method: 'PATCH', token }),
};

export const analyticsApi = {
  getMyStats: (token) => request('/analytics/me-stats', { token }),
  getLeaderboard: (token) => request('/analytics/leaderboard', { token }),
  getUsers: (token) => request('/analytics/users', { token }),
};
