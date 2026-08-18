if (typeof window !== 'undefined') {
  const checkContainer = setInterval(() => {
    const container = (window as any).the_himalayan_table;
    if (container && typeof container.get === 'function' && typeof container.init === 'function') {
      clearInterval(checkContainer);
      console.log('[the-himalayan-table] Federation container is ready');
    }
  }, 100);

  setTimeout(() => clearInterval(checkContainer), 5000);
}

// Async import creates the needed Module Federation execution boundary
import('./bootstrap').catch((err) => {
  console.error('Failed to load application:', err);
  if (typeof document !== 'undefined') {
    document.body.innerHTML = '<h1>Error loading application</h1>';
  }
});