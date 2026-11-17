import Link from 'next/link';

/** Trang chủ — SSG */
export default function HomePage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Thư viện trường</h1>
      <p>Tra cứu sách và gửi yêu cầu mượn trực tuyến.</p>
      <p>
        <Link href="/books" className="underline">
          Xem danh mục sách
        </Link>
      </p>
    </div>
  );
}
