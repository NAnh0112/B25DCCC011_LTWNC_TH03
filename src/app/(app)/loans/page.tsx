import { auth } from '@/auth';
import { db } from '@/lib/db';
import { listLoans } from '@/lib/loans';
import { formatDate } from '@/lib/format';
import { can, type Role } from '@/lib/permissions';
import LoanForm from '@/components/LoanForm';
import { createLoanAction, cancelLoanAction } from './actions';
import Link from 'next/link';
import { TERM_LABEL, STATUS_LABEL, type LoanStatus } from '@/types';

export default async function LoansPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; book?: string }> | {
    status?: string;
    page?: string;
    book?: string;
  };
}) {
  const session = await auth();
  if (!session?.user?.email || !session.user.role) {
    return <div>Vui lòng đăng nhập</div>;
  }

  const params = await searchParams;
  const status = params.status ?? '';
  const page = Number(params.page) || 1;
  const result = listLoans(
    { email: session.user.email, role: session.user.role },
    status,
    page,
  );
  const role = session.user.role as Role;
  const canCreate = can(role, 'loan:create');
  const defaultBookId = params.book ? Number(params.book) : undefined;

  const statusQuery = status ? `status=${encodeURIComponent(status)}&` : '';

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Sách đã mượn</h1>

      <form method="GET" className="flex gap-4 items-center">
        <label htmlFor="status">Trạng thái</label>
        <select
          id="status"
          name="status"
          defaultValue={status}
          className="border p-2"
        >
          <option value="">Tất cả</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>
        <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded">
          Lọc
        </button>
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Tên sách</th>
            <th className="border p-2">Ngày lấy</th>
            <th className="border p-2">Thời hạn</th>
            <th className="border p-2">Số lượng</th>
            <th className="border p-2">Trạng thái</th>
            {canCreate && <th className="border p-2">Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {result.items.map((loan) => (
            <tr key={loan.id}>
              <td className="border p-2">{loan.bookTitle}</td>
              <td className="border p-2">{formatDate(loan.pickupDate)}</td>
              <td className="border p-2">{TERM_LABEL[loan.term]}</td>
              <td className="border p-2">{loan.quantity} quyển</td>
              <td className="border p-2">
                {STATUS_LABEL[loan.status as LoanStatus]}
              </td>
              {canCreate && (
                <td className="border p-2">
                  {loan.status === 'pending' &&
                    loan.email === session.user!.email && (
                      <form action={cancelLoanAction.bind(null, loan.id)}>
                        <button type="submit" className="text-red-600 underline">
                          Hủy
                        </button>
                      </form>
                    )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-4 items-center">
        {result.page > 1 ? (
          <Link
            href={`/loans?${statusQuery}page=${result.page - 1}`}
            className="underline"
          >
            Trước
          </Link>
        ) : (
          <span>Trước</span>
        )}
        <span>
          Trang {result.page}/{result.totalPages}
        </span>
        {result.page < result.totalPages ? (
          <Link
            href={`/loans?${statusQuery}page=${result.page + 1}`}
            className="underline"
          >
            Sau
          </Link>
        ) : (
          <span>Sau</span>
        )}
      </div>

      {canCreate && (
        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-bold mb-4">Gửi yêu cầu mượn sách</h2>
          <LoanForm
            books={db.books}
            defaultBookId={
              defaultBookId && !Number.isNaN(defaultBookId)
                ? defaultBookId
                : undefined
            }
            action={createLoanAction}
          />
        </div>
      )}
    </div>
  );
}
