import { Geist_Mono, Roboto } from 'next/font/google';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const roboto = Roboto({ subsets: ['latin'], variable: '--font-sans' });

const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        'antialiased',
        fontMono.variable,
        'font-sans',
        roboto.variable
      )}
    >
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col bg-background">
            <header className="border-b px-6 py-4">
              <h1 className="text-2xl font-bold">Vendor Aggregation</h1>
            </header>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
