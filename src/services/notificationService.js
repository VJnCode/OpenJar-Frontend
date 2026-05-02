import { apiFetch } from '../api/client';

export const testTemplate = (data) => apiFetch('/api/notifications/test-template', { method: 'POST', body: JSON.stringify(data) });
