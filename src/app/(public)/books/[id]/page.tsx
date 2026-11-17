import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllBookIds, getBook } from '@/lib/books';

export const revalidate = 60;

export function generateStaticParams() {
  return getAllBookIds().map((id) => ({ id: String(id) }));
}

/** Chi tiết sách — SSG + ISR */
export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await params;
  const book = getBook(Number(id));
  if (!book) notFound();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{book.title}</h1>
      <p>
        <strong>Tác giả:</strong> {book.author}
      </p>
      <p>
        <strong>Thể loại:</strong> {book.category}
      </p>
      <p>
        <strong>Số bản:</strong> {book.stock}
      </p>
      <p>{book.description}</p>
      <p>
        <Link href={`/loans?book=${book.id}`} className="underline">
          Mượn sách này
        </Link>
      </p>
      <p>
        <Link href="/books" className="underline">
          ← Quay lại danh mục
        </Link>
      </p>
    </div>
  );
}
