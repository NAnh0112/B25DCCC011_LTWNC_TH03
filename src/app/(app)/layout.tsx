import { auth } from '@/auth';
import { redirect } from 'next/navigation';

/** Layout khu vực đăng nhập — gọi auth() tại đây, không ở layout gốc. */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  return <>{children}</>;
}
