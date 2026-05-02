import { apiFetch } from '../api/client';

export const getComments  = (recipeId)                  => apiFetch(`/api/social/comments/recipe/${recipeId}`);
export const addComment   = (data)                      => apiFetch('/api/social/comments/add', { method: 'POST', body: JSON.stringify(data) });
export const replyComment = (recipeId, parentId, data)  => apiFetch(`/api/social/comments/${recipeId}/${parentId}`, { method: 'POST', body: JSON.stringify(data) });
