import { books as seedBooks } from '@/data/books';
import type { Book, Loan } from '@/types';

const SV01 = 'sv01@st.hcmuaf.edu.vn';
const SV02 = 'sv02@st.hcmuaf.edu.vn';

function buildSeedLoans(): Loan[] {
  const loans: Loan[] = [];
  let id = 1;

  // Yêu cầu mẫu đã duyệt — chiếm 1 bản sách id 6 ngày 2026-12-02
  loans.push({
    id: id++,
    email: SV01,
    bookId: 6,
    pickupDate: '2026-12-02',
    term: 14,
    quantity: 1,
    reason: 'Ôn tập an toàn mạng cuối kỳ',
    status: 'approved',
  });

  // Yêu cầu mẫu bị từ chối — không chiếm bản (cùng sách 2, ngày 2026-12-03)
  loans.push({
    id: id++,
    email: SV01,
    bookId: 2,
    pickupDate: '2026-12-03',
    term: 14,
    quantity: 1,
    reason: 'Làm bài tập lớn cơ sở dữ liệu',
    status: 'rejected',
  });

  // sv01: thêm 7 pending nữa → tổng 9 pending (kèm các pending bên dưới)
  // Đếm mục tiêu: sv01 = 27, trong đó pending = 9; sv02 = 10; tổng = 37
  // Đã có 1 approved + 1 rejected cho sv01 → còn 25 cho sv01

  // 8 pending cho sv01 (cộng với các khoản khác để đạt đúng 9 pending)
  for (let i = 0; i < 8; i++) {
    loans.push({
      id: id++,
      email: SV01,
      bookId: 3,
      pickupDate: `2026-12-${String(10 + i).padStart(2, '0')}`,
      term: 7,
      quantity: 1,
      reason: `Yêu cầu chờ duyệt số ${i + 1} của sv01`,
      status: 'pending',
    });
  }
  // 1 pending nữa → 9 pending
  loans.push({
    id: id++,
    email: SV01,
    bookId: 4,
    pickupDate: '2026-12-20',
    term: 7,
    quantity: 1,
    reason: 'Yêu cầu chờ duyệt cuối của sv01',
    status: 'pending',
  });

  // Còn lại sv01: 27 - 1 approved - 1 rejected - 9 pending = 16 approved/rejected
  for (let i = 0; i < 10; i++) {
    loans.push({
      id: id++,
      email: SV01,
      bookId: 5,
      pickupDate: `2026-11-${String(1 + i).padStart(2, '0')}`,
      term: 14,
      quantity: 1,
      reason: `Yêu cầu đã duyệt lịch sử ${i + 1}`,
      status: 'approved',
    });
  }
  for (let i = 0; i < 6; i++) {
    loans.push({
      id: id++,
      email: SV01,
      bookId: 7,
      pickupDate: `2026-10-${String(1 + i).padStart(2, '0')}`,
      term: 30,
      quantity: 1,
      reason: `Yêu cầu bị từ chối lịch sử ${i + 1}`,
      status: 'rejected',
    });
  }
  // sv01 count: 1+1+9+10+6 = 27 ✓

  // sv02: 10 yêu cầu; 6 pending → admin pending = 9+6 = 15 → Trang 1/2
  for (let i = 0; i < 6; i++) {
    loans.push({
      id: id++,
      email: SV02,
      bookId: 8,
      pickupDate: `2026-12-${String(5 + i).padStart(2, '0')}`,
      term: 7,
      quantity: 1,
      reason: `Yêu cầu chờ duyệt của sv02 số ${i + 1}`,
      status: 'pending',
    });
  }
  for (let i = 0; i < 4; i++) {
    loans.push({
      id: id++,
      email: SV02,
      bookId: 3,
      pickupDate: `2026-09-${String(1 + i).padStart(2, '0')}`,
      term: 14,
      quantity: 1,
      reason: `Yêu cầu đã duyệt của sv02 số ${i + 1}`,
      status: 'approved',
    });
  }
  // tổng 37 ✓

  return loans;
}

const initialLoans = buildSeedLoans();

class Database {
  books: Book[] = seedBooks.map((b) => ({ ...b }));
  loans: Loan[] = initialLoans.map((l) => ({ ...l }));
  nextLoanId = initialLoans.length + 1;

  reset() {
    this.books = seedBooks.map((b) => ({ ...b }));
    this.loans = initialLoans.map((l) => ({ ...l }));
    this.nextLoanId = initialLoans.length + 1;
  }
}

export const db = new Database();
