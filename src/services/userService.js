import { apiFetch } from '../api/client';

export const getCurrentUser = ()       => apiFetch('/api/users/me');
export const updateMe       = (data)   => apiFetch('/api/users/me', { method: 'PUT', body: data });
export const deleteMe       = ()       => apiFetch('/api/users/me', { method: 'DELETE' });
export const getUser        = (id)     => apiFetch(`/api/users/${encodeURIComponent(id)}`);
export const registerUser   = (data)   => apiFetch('/api/users/register',   { method: 'POST', body: data });
export const verifyUser     = (data)   => apiFetch('/api/users/verify',     { method: 'POST', body: data });
export const resendOtp      = (email)  => apiFetch('/api/users/resend-otp', { method: 'POST', body: { email } });
