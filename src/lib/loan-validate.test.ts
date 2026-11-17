import { describe, it, expect, vi, afterEach } from 'vitest';
import { validateLoan, toLoanData, today } from './loan-validate';

describe('loan-validate', () => {
  const books = [
    { id: 1, stock: 1 },
    { id: 2, stock: 5 },
  ];

  afterEach(() => {
    vi.useRealTimers();
  });

  it('validateLoan: dữ liệu hợp lệ trả object rỗng', () => {
    vi.setSystemTime(new Date('2026-11-17T12:00:00'));
    const errors = validateLoan(
      {
        bookId: '1',
        pickupDate: '2026-11-17',
        term: '14',
        quantity: '1',
        reason: 'Đọc nghiên cứu học tập',
      },
      books,
    );
    expect(errors).toEqual({});
  });

  it('validateLoan: form trống báo đủ lỗi', () => {
    const errors = validateLoan(
      { bookId: '', pickupDate: '', term: '', quantity: '1', reason: '' },
      books,
    );
    expect(errors.bookId).toBe('Hãy chọn sách');
    expect(errors.pickupDate).toBe('Hãy chọn ngày');
    expect(errors.term).toBe('Hãy chọn thời hạn');
    expect(errors.reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('validateLoan: ngày lấy sách quá khứ', () => {
    vi.setSystemTime(new Date('2026-11-17T12:00:00'));
    const errors = validateLoan(
      {
        bookId: '1',
        pickupDate: '2026-11-16',
        term: '7',
        quantity: '1',
        reason: 'Lý do đủ dài rồi nhé',
      },
      books,
    );
    expect(errors.pickupDate).toBe('Ngày lấy sách không được ở quá khứ');
  });

  it('validateLoan: lý do dưới 10 ký tự (kể cả toàn khoảng trắng)', () => {
    vi.setSystemTime(new Date('2026-11-17T12:00:00'));
    const short = validateLoan(
      {
        bookId: '1',
        pickupDate: today(),
        term: '7',
        quantity: '1',
        reason: 'ngắn quá',
      },
      books,
    );
    expect(short.reason).toBe('Lý do tối thiểu 10 ký tự');

    const spaces = validateLoan(
      {
        bookId: '1',
        pickupDate: today(),
        term: '7',
        quantity: '1',
        reason: '          ',
      },
      books,
    );
    expect(spaces.reason).toBe('Lý do tối thiểu 10 ký tự');
  });

  it('validateLoan: số quyển vượt số bản (sách id 1 có 1 bản, mượn 2)', () => {
    vi.setSystemTime(new Date('2026-11-17T12:00:00'));
    const errors = validateLoan(
      {
        bookId: '1',
        pickupDate: today(),
        term: '7',
        quantity: '2',
        reason: 'Lý do đủ dài rồi nhé',
      },
      books,
    );
    expect(errors.quantity).toBe('Vượt số bản của sách (1 bản)');
  });

  it('validateLoan: số quyển không phải số nguyên dương', () => {
    vi.setSystemTime(new Date('2026-11-17T12:00:00'));
    const zero = validateLoan(
      {
        bookId: '1',
        pickupDate: today(),
        term: '7',
        quantity: '0',
        reason: 'Lý do đủ dài rồi nhé',
      },
      books,
    );
    expect(zero.quantity).toBe('Số quyển phải từ 1 trở lên');

    const decimal = validateLoan(
      {
        bookId: '1',
        pickupDate: today(),
        term: '7',
        quantity: '1.5',
        reason: 'Lý do đủ dài rồi nhé',
      },
      books,
    );
    expect(decimal.quantity).toBe('Số quyển phải từ 1 trở lên');
  });

  it('validateLoan: thời hạn không hợp lệ (10)', () => {
    vi.setSystemTime(new Date('2026-11-17T12:00:00'));
    const errors = validateLoan(
      {
        bookId: '1',
        pickupDate: today(),
        term: '10',
        quantity: '1',
        reason: 'Lý do đủ dài rồi nhé',
      },
      books,
    );
    expect(errors.term).toBe('Hãy chọn thời hạn');
  });

  it('toLoanData: ép kiểu số từ chuỗi', () => {
    const data = toLoanData({
      bookId: '2',
      pickupDate: '2026-12-03',
      term: '14',
      quantity: '3',
      reason: '  cần đọc thêm tài liệu  ',
    });
    expect(data).toEqual({
      bookId: 2,
      pickupDate: '2026-12-03',
      term: 14,
      quantity: 3,
      reason: 'cần đọc thêm tài liệu',
    });
  });
});
