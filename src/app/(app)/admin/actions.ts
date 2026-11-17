'use server';

import { auth } from '@/auth';
import { can, type Role } from '@/lib/permissions';
import { db } from '@/lib/db';
import type { LoanStatus } from '@/types';
import { revalidatePath } from 'next/cache';

export async function reviewLoanAction(id: number, status: Extract<LoanStatus, 'approved' | 'rejected'>) {
  const session = await auth();
  if (!session?.user?.role || !can(session.user.role as Role, 'loan:review')) {
    throw new Error('Không có quyền');
  }
  const loan = db.loans.find((l) => l.id === id);
  if (loan && loan.status === 'pending') {
    loan.status = status;
  }
  revalidatePath('/admin');
  revalidatePath('/loans');
}
