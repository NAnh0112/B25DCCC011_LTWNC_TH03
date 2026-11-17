export type Role = 'guest' | 'student' | 'admin';

export type LoanStatus = 'pending' | 'approved' | 'rejected';

export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  stock: number;
  description: string;
}

export interface User {
  email: string;
  name: string;
  password: string;
  role: Exclude<Role, 'guest'>;
}

export interface Loan {
  id: number;
  email: string;
  bookId: number;
  pickupDate: string;
  term: 7 | 14 | 30;
  quantity: number;
  reason: string;
  status: LoanStatus;
}

export const TERM_LABEL: Record<7 | 14 | 30, string> = {
  7: '7 ngày',
  14: '14 ngày',
  30: '30 ngày',
};

export const STATUS_LABEL: Record<LoanStatus, string> = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};
