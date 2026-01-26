// Initialize app and validate environment
// Path: app/layout.js

'use client';

import { useEffect } from 'react';

export default function RootLayout({ children }) {
  useEffect(() => {
    // Validate environment on load
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) {
          console.warn('Health check failed:', data.error);
        }
      })
      .catch((error) => console.error('Health check error:', error));
  }, []);

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
