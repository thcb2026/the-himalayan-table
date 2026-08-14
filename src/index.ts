// Dynamic import of bootstrap to ensure shared modules are initialized
import('./bootstrap').catch(err => {
  console.error('Failed to load application:', err);
  document.body.innerHTML = '<h1>Error loading application</h1>';
});
