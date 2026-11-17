import { auth } from '@/auth';
import { db } from '@/lib/db';
import { can, type Role } from '@/lib/permissions';
import { formatDate } from '@/lib/format';
import { STATUS_LABEL, TERM_LABEL, type LoanStatus } from '@/types';
import { redirect } from 'next/navigation';
import { reviewLoanAction } from './actions';

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.role || !can(session.user.role as Role, 'loan:review')) {
    redirect('/forbidden');
  }

  const pending = db.loans.filter((l) => l.status === 'pending');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Duyệt yêu cầu mượn</h1>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Email</th>
            <th className="border p-2">Sách</th>
            <th className="border p-2">Ngày lấy</th>
            <th className="border p-2">Thời hạn</th>
            <th className="border p-2">Số lượng</th>
            <th className="border p-2">Trạng thái</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pending.map((loan) => {
            const book = db.books.find((b) => b.id === loan.bookId);
            return (
              <tr key={loan.id}>
                <td className="border p-2">{loan.email}</td>
                <td className="border p-2">{book?.title ?? loan.bookId}</td>
                <td className="border p-2">{formatDate(loan.pickupDate)}</td>
                <td className="border p-2">{TERM_LABEL[loan.term]}</td>
                <td className="border p-2">{loan.quantity}</td>
                <td className="border p-2">
                  {STATUS_LABEL[loan.status as LoanStatus]}
                </td>
                <td className="border p-2">
                  <form action={reviewLoanAction.bind(null, loan.id, 'approved')} style={{ display: 'inline' }}>
                    <button type="submit" className="underline">
                      Duyệt
                    </button>
                  </form>{' '}
                  <form action={reviewLoanAction.bind(null, loan.id, 'rejected')} style={{ display: 'inline' }}>
                    <button type="submit" className="underline text-red-600">
                      Từ chối
                    </button>
                  </form>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
