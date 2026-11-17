import { apiFetch } from '../api/client';

export const getRecipes        = ()         => apiFetch('/recipe');
export const getRecipe         = (id)       => apiFetch(`/recipe/${encodeURIComponent(id)}`);
export const getRecipesByUser  = (userId)   => apiFetch(`/recipe/user/${encodeURIComponent(userId)}`);
// The owner is taken from the session on the server; it is never sent by the client.
export const createRecipe      = (data)     => apiFetch('/recipe', { method: 'POST', body: data });
export const updateRecipe      = (id, data) => apiFetch(`/recipe/${encodeURIComponent(id)}`, { method: 'PUT', body: data });
export const deleteRecipe      = (id)       => apiFetch(`/recipe/${encodeURIComponent(id)}`, { method: 'DELETE' });

/** Ingredients are stored one per line; older recipes used commas. */
export function splitIngredients(text = '') {
  const byLine = text.split(/\n+/).map(s => s.trim()).filter(Boolean);
  return byLine.length > 1 ? byLine : text.split(/,+/).map(s => s.trim()).filter(Boolean);
}

export function splitSteps(text = '') {
  return text.split(/\n+/).map(s => s.replace(/^\d+[.)]\s*/, '').trim()).filter(Boolean);
}
