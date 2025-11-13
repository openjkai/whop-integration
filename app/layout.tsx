import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Whop Payment Integration',
  description: 'Complete subscription management with Whop payment gateway',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}

