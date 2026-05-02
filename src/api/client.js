export async function apiFetch(path, options = {}) {
  const { headers, ...rest } = options;
  const res = await fetch(path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...headers },
    ...rest,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(text || 'Request failed');
  try { return JSON.parse(text); } catch { return text; }
}
