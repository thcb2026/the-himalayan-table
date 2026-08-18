// Register a host-safe global adapter early so the Angular shell can resolve the
// remote mount contract before the app bootstraps.
if (typeof window !== 'undefined') {
  const existing = (window as Window & {
    the_himalayan_table?: { get?: (module: string) => Promise<() => unknown>; init?: () => Promise<void> };
  }).the_himalayan_table;

  if (!existing || typeof existing.get !== 'function' || typeof existing.init !== 'function') {
    const mountModule = async () => {
      const mount = await import('./remote/mount');
      return () => ({
        default: mount.default ?? mount.mount,
        mount: mount.mount,
        unmount: mount.unmount,
      });
    };

    (window as Window & {
      the_himalayan_table?: {
        get: (module: string) => Promise<() => unknown>;
        init: () => Promise<void>;
      };
    }).the_himalayan_table = {
      get: async (module: string) => {
        if (module === './Mount') {
          return mountModule();
        }
        return async () => ({ default: undefined });
      },
      init: async () => undefined,
    };
  }
}

// Dynamic import of bootstrap to ensure shared modules are initialized
import('./bootstrap').catch(err => {
  console.error('Failed to load application:', err);
  document.body.innerHTML = '<h1>Error loading application</h1>';
});
