import { apiFetch } from '../api/client';

const enc = encodeURIComponent;

// Comments: the author is taken from the session server-side.
export const getComments   = async (recipeId) => (await apiFetch(`/api/social/comments/recipe/${enc(recipeId)}`))?.data ?? [];
export const addComment    = async (recipeId, content) =>
  (await apiFetch('/api/social/comments/add', { method: 'POST', body: { recipeId: String(recipeId), content } })).data;
export const replyComment  = async (recipeId, parentId, content) =>
  (await apiFetch(`/api/social/comments/${enc(recipeId)}/${enc(parentId)}`, { method: 'POST', body: { content } })).data;
export const deleteComment = (commentId) => apiFetch(`/api/social/comments/${enc(commentId)}`, { method: 'DELETE' });

// Likes: { totalLikes, liked }
export const getLikes   = (recipeId) => apiFetch(`/api/social/likes/${enc(recipeId)}`);
export const toggleLike = (recipeId) => apiFetch(`/api/social/likes/${enc(recipeId)}`, { method: 'POST' });
