import { useEffect, useState } from 'react';
import { getUser } from '../services/userService';

// One request per user id for the whole session, shared by every card on the page.
const cache = new Map();   // userId -> Promise<{ userId, userName } | null>

function load(userId) {
  if (!cache.has(userId)) {
    cache.set(userId, getUser(userId).catch(() => null));
  }
  return cache.get(userId);
}

/**
 * Public profile (name only, never email) for showing who cooked something.
 * Returns undefined while loading, null if the user can't be found.
 */
export default function usePublicUser(userId) {
  const [state, setState] = useState({ id: undefined, user: undefined });

  useEffect(() => {
    if (!userId) return undefined;
    let alive = true;
    load(userId).then(u => { if (alive) setState({ id: userId, user: u }); });
    return () => { alive = false; };
  }, [userId]);

  if (!userId) return null;
  return state.id === userId ? state.user : undefined;
}

/** Call after the current user renames themselves so cards pick up the new name. */
export function forgetPublicUser(userId) {
  cache.delete(userId);
}
