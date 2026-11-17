'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <header
      style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid #ddd',
        background: '#fff',
      }}
    >
      <Link href="/" style={{ fontWeight: 700 }}>
        Thư viện
      </Link>
      <Link href="/books">Sách</Link>
      {session?.user && <Link href="/loans">Mượn sách</Link>}
      {role === 'admin' && <Link href="/admin">Duyệt</Link>}
      <span style={{ marginLeft: 'auto' }}>
        {session?.user ? (
          <>
            {session.user.email}{' '}
            <button type="button" onClick={() => signOut({ callbackUrl: '/' })}>
              Đăng xuất
            </button>
          </>
        ) : (
          <Link href="/login">Đăng nhập</Link>
        )}
      </span>
    </header>
  );
}
