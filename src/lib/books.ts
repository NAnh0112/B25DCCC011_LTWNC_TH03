import { db } from './db';
import type { Book } from '@/types';

export function listBooks(query?: string): Book[] {
  const q = (query ?? '').trim().toLowerCase();
  if (!q) return [...db.books];
  return db.books.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q),
  );
}

export function getBook(id: number): Book | undefined {
  return db.books.find((b) => b.id === id);
}

export function getAllBookIds(): number[] {
  return db.books.map((b) => b.id);
}
