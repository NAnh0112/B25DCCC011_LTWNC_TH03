import { describe, it, expect, beforeEach } from 'vitest';
import { listLoans, submitLoan, cancelLoan } from './loans';
import { db } from './db';

describe('loans', () => {
  beforeEach(() => {
    db.reset();
  });

  it('listLoans: sv01 có 27 yêu cầu chia 3 trang (10/10/7), admin thấy 37, trang vượt bị kẹp', () => {
    const page1 = listLoans({ email: 'sv01@st.hcmuaf.edu.vn', role: 'student' }, '', 1);
    expect(page1.total).toBe(27);
    expect(page1.totalPages).toBe(3);
    expect(page1.items.length).toBe(10);
    expect(page1.page).toBe(1);

    const page2 = listLoans({ email: 'sv01@st.hcmuaf.edu.vn', role: 'student' }, '', 2);
    expect(page2.items.length).toBe(10);

    const page3 = listLoans({ email: 'sv01@st.hcmuaf.edu.vn', role: 'student' }, '', 3);
    expect(page3.items.length).toBe(7);

    const admin = listLoans({ email: 'admin@hcmuaf.edu.vn', role: 'admin' }, '', 1);
    expect(admin.total).toBe(37);
    expect(admin.totalPages).toBe(4);

    const clamped = listLoans({ email: 'sv01@st.hcmuaf.edu.vn', role: 'student' }, '', 99);
    expect(clamped.page).toBe(3);
  });

  it('submitLoan trả hết bản với sách id 6 ngày 2026-12-02', () => {
    const result = submitLoan('sv01@st.hcmuaf.edu.vn', {
      bookId: 6,
      pickupDate: '2026-12-02',
      term: 14,
      quantity: 1,
      reason: 'Muốn mượn thêm bản nữa',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toBe('Sách đã hết bản vào ngày này');
    }
  });

  it('tạo được rồi cancelLoan đúng 3 mã forbidden, ok, not-found', () => {
    const created = submitLoan('sv01@st.hcmuaf.edu.vn', {
      bookId: 2,
      pickupDate: '2026-12-10',
      term: 7,
      quantity: 1,
      reason: 'Mượn sách cơ sở dữ liệu',
    });
    expect(created.ok).toBe(true);
    if (!created.ok) return;

    expect(cancelLoan('sv02@st.hcmuaf.edu.vn', created.loan.id)).toBe('forbidden');
    expect(cancelLoan('sv01@st.hcmuaf.edu.vn', created.loan.id)).toBe('ok');
    expect(cancelLoan('sv01@st.hcmuaf.edu.vn', 99999)).toBe('not-found');
  });
});
