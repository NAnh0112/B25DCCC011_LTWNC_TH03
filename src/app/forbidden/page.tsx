import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">403 — Không có quyền</h1>
      <Link href="/" className="underline">
        Về trang chủ
      </Link>
    </div>
  );
}
