import Link from 'next/link';

export default function BookNotFound() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Không tìm thấy sách</h1>
      <Link href="/books" className="underline">
        Quay lại danh mục
      </Link>
    </div>
  );
}
