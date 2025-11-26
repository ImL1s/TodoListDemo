import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from '@remix-run/react';
import type { LinksFunction } from '@remix-run/node';

import globalStyles from '~/styles/global.css?url';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: globalStyles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  return (
    <html lang="en">
      <head>
        <title>Oops! Something went wrong</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container">
          <div className="card">
            <div className="error-state">
              <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</h1>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                {isRouteErrorResponse(error)
                  ? `${error.status} ${error.statusText}`
                  : 'Application Error'}
              </h2>
              <p style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)' }}>
                {isRouteErrorResponse(error)
                  ? error.data
                  : error instanceof Error
                  ? error.message
                  : 'An unexpected error occurred'}
              </p>
              <a
                href="/"
                className="btn btn-primary"
                style={{ display: 'inline-block' }}
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
