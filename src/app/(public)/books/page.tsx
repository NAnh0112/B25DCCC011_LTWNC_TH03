import Link from 'next/link';
import { listBooks } from '@/lib/books';

/** Danh mục sách — SSR (đọc searchParams) */
export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }> | { q?: string };
}) {
  const params = await searchParams;
  const q = params.q ?? '';
  const books = listBooks(q);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Danh mục sách</h1>
      <form method="GET" className="flex gap-4 items-center">
        <label htmlFor="q">Tìm kiếm</label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          className="border p-2"
          placeholder="Tên, tác giả, thể loại..."
        />
        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">
          Lọc
        </button>
      </form>
      <ul className="space-y-4">
        {books.map((book) => (
          <li key={book.id}>
            <Link href={`/books/${book.id}`} className="underline font-medium">
              {book.title}
            </Link>
            <span>
              {' '}
              — {book.author} ({book.stock} bản)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
