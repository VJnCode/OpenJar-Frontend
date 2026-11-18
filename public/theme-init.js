// Runs before first paint (loaded synchronously in <head>) so there is no light/dark flash.
// Kept as a file rather than an inline <script> so the Content-Security-Policy can stay strict.
(function () {
  try {
    var p = localStorage.getItem('oj-theme');
    if (p === 'dark' || (p !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch { /* storage blocked: fall back to light */ }
})();
