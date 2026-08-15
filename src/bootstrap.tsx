import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './AppMUI';
import { appStore } from './store';
import { ErrorBoundary } from './ErrorBoundary';

// Initialize the application
const container = document.getElementById('root');

if (container) {
  const root = ReactDOM.createRoot(container);
  // Use JSX for proper Provider children typing
  const jsx = (
    <React.StrictMode>
      <ErrorBoundary>
        <Provider store={appStore}>
          <App />
        </Provider>
      </ErrorBoundary>
    </React.StrictMode>
  );
  root.render(jsx);
}
