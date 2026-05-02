import { apiFetch } from '../api/client';

export const getUsers     = ()         => apiFetch('/api/users');
export const getUser      = (id)       => apiFetch(`/api/users/${id}`);
export const updateUser   = (id, data) => apiFetch(`/api/users/${id}`, { method: 'PUT',    body: JSON.stringify(data) });
export const deleteUser   = (id)       => apiFetch(`/api/users/${id}`, { method: 'DELETE' });
export const verifyUser   = (data)     => apiFetch('/api/users/verify',   { method: 'POST', body: JSON.stringify(data) });
export const registerUser = (data)     => apiFetch('/api/users/register', { method: 'POST', body: JSON.stringify(data) });
