import { apiFetch } from '../api/client';

export const getRecipes   = ()             => apiFetch('/recipe');
export const getRecipe    = (id)           => apiFetch(`/recipe/${id}`);
export const createRecipe = (userId, data) => apiFetch(`/recipe/${userId}`, { method: 'POST', body: JSON.stringify(data) });
export const updateRecipe = (id, data)     => apiFetch(`/recipe/${id}`,     { method: 'PUT',  body: JSON.stringify(data) });
export const deleteRecipe = (id)           => apiFetch(`/recipe/${id}`,     { method: 'DELETE' });
