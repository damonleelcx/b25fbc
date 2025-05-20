import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Journey Builder',
  description: 'Form-based workflow builder with prefill configuration',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Journey Builder</h1>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}