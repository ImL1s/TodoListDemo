/**
 * Application Entry Point
 *
 * Notice: NO PROVIDER WRAPPER NEEDED
 *
 * This is one of Jotai's key advantages over Recoil and Redux.
 * Atoms are globally accessible without any setup.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

/*
 * COMPARISON WITH OTHER LIBRARIES:
 *
 * Recoil (needs RecoilRoot):
 *   <React.StrictMode>
 *     <RecoilRoot>
 *       <App />
 *     </RecoilRoot>
 *   </React.StrictMode>
 *
 * Redux (needs Provider):
 *   <React.StrictMode>
 *     <Provider store={store}>
 *       <App />
 *     </Provider>
 *   </React.StrictMode>
 *
 * Jotai (no wrapper needed):
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>
 *
 * This makes Jotai:
 * - Easier to set up
 * - Less boilerplate
 * - More flexible for code splitting
 * - Simpler to test
 */
