import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Thư viện trường',
  description: 'Hệ thống mượn sách thư viện',
};

/** Layout gốc KHÔNG gọi auth() — giữ / và /books/[id] là Static/SSG. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
