import { db } from './db';
import { can, type Role } from './permissions';
import type { Loan, LoanStatus } from '@/types';
import type { LoanData } from './loan-validate';

export function parseStatus(v: unknown): LoanStatus | undefined {
  if (typeof v === 'string' && ['pending', 'approved', 'rejected'].includes(v)) {
    return v as LoanStatus;
  }
  return undefined;
}

export function listLoans(
  viewer: { email: string; role: string },
  status?: string,
  page: number = 1,
) {
  let items = [...db.loans];

  // student không có loan:review → chỉ thấy của mình; admin (loan:review) thấy tất cả
  if (!can(viewer.role as Role, 'loan:review')) {
    items = items.filter((l) => l.email === viewer.email);
  }

  const parsedStatus = parseStatus(status);
  if (parsedStatus) {
    items = items.filter((l) => l.status === parsedStatus);
  }

  const itemsWithTitle = items.map((l) => {
    const book = db.books.find((b) => b.id === l.bookId);
    return { ...l, bookTitle: book ? book.title : 'Sách không rõ' };
  });

  const pageSize = 10;
  const total = itemsWithTitle.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.max(1, Math.min(page, totalPages));
  const start = (clampedPage - 1) * pageSize;

  return {
    items: itemsWithTitle.slice(start, start + pageSize),
    total,
    page: clampedPage,
    totalPages,
  };
}

export function submitLoan(
  email: string,
  data: LoanData,
): { ok: true; loan: Loan } | { ok: false; message: string } {
  const book = db.books.find((b) => b.id === data.bookId);
  if (!book) return { ok: false, message: 'Sách không tồn tại' };

  const activeLoans = db.loans.filter(
    (l) =>
      l.bookId === data.bookId &&
      l.pickupDate === data.pickupDate &&
      l.status !== 'rejected',
  );
  const totalActiveQty = activeLoans.reduce((sum, l) => sum + l.quantity, 0);

  if (totalActiveQty + data.quantity > book.stock) {
    return { ok: false, message: 'Sách đã hết bản vào ngày này' };
  }

  const newLoan: Loan = {
    id: db.nextLoanId++,
    email,
    bookId: data.bookId,
    pickupDate: data.pickupDate,
    term: data.term,
    quantity: data.quantity,
    reason: data.reason,
    status: 'pending',
  };

  db.loans.unshift(newLoan);
  return { ok: true, loan: newLoan };
}

export function cancelLoan(
  email: string,
  id: number,
): 'not-found' | 'forbidden' | 'not-pending' | 'ok' {
  const index = db.loans.findIndex((l) => l.id === id);
  if (index === -1) return 'not-found';

  const loan = db.loans[index];
  if (loan.email !== email) return 'forbidden';
  if (loan.status !== 'pending') return 'not-pending';

  db.loans.splice(index, 1);
  return 'ok';
}
