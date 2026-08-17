import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from '../AppMUI';
import { appStore } from '../store';
import { ErrorBoundary } from '../ErrorBoundary';

const mountedRoots = new WeakMap<Element, Root>();

export interface HimalayanTableMountOptions {
  props?: Record<string, unknown>;
}

const createOrGetRoot = (container: Element): Root => {
  let root = mountedRoots.get(container);
  if (!root) {
    root = createRoot(container);
    mountedRoots.set(container, root);
  }
  return root;
};

export const mount = (container: Element, _options: HimalayanTableMountOptions = {}): (() => void) => {
  const root = createOrGetRoot(container);

  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={appStore}>
          <App />
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>,
  );

  return () => unmount(container);
};

export const unmount = (container: Element): void => {
  const root = mountedRoots.get(container);
  if (!root) {
    return;
  }

  root.unmount();
  mountedRoots.delete(container);
};

export default mount;
