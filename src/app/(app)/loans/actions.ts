'use server';

import { auth } from '@/auth';
import { can, type Role } from '@/lib/permissions';
import {
  toLoanInput,
  validateLoan,
  toLoanData,
  type LoanFormState,
} from '@/lib/loan-validate';
import { submitLoan, cancelLoan } from '@/lib/loans';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createLoanAction(
  prevState: LoanFormState,
  formData: FormData,
): Promise<LoanFormState> {
  void prevState;
  const session = await auth();
  if (!session?.user?.email || !session.user.role) {
    throw new Error('Không có quyền');
  }
  if (!can(session.user.role as Role, 'loan:create')) {
    throw new Error('Không có quyền');
  }

  const values = toLoanInput(formData);
  const errors = validateLoan(values, db.books);

  if (Object.keys(errors).length > 0) {
    return { errors, values };
  }

  const result = submitLoan(session.user.email, toLoanData(values));
  if (!result.ok) {
    return {
      errors: {},
      values,
      message: result.message,
      ok: false,
    };
  }

  revalidatePath('/loans');
  return {
    errors: {},
    values: {},
    message: 'Đã gửi yêu cầu, chờ duyệt',
    ok: true,
  };
}

export async function cancelLoanAction(id: number) {
  const session = await auth();
  if (!session?.user?.email || !session.user.role) {
    throw new Error('Không có quyền');
  }
  if (!can(session.user.role as Role, 'loan:create')) {
    throw new Error('Không có quyền');
  }

  cancelLoan(session.user.email, id);
  revalidatePath('/loans');
}
