import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoanForm from './LoanForm';
import type { LoanFormState } from '@/lib/loan-validate';

describe('LoanForm', () => {
  const books = [
    { id: 1, title: 'Lập trình C căn bản', stock: 1 },
    { id: 6, title: 'An toàn mạng', stock: 1 },
  ];

  afterEach(() => {
    cleanup();
  });

  it('action trả errors thì lỗi hiện ra dưới đúng ô', async () => {
    const action = vi.fn(async (): Promise<LoanFormState> => ({
      errors: {
        bookId: 'Hãy chọn sách',
        pickupDate: 'Hãy chọn ngày',
        term: 'Hãy chọn thời hạn',
        reason: 'Lý do tối thiểu 10 ký tự',
      },
      values: {},
    }));

    render(<LoanForm books={books} action={action} />);
    fireEvent.submit(screen.getByRole('button', { name: 'Gửi yêu cầu' }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Hãy chọn sách')).toBeInTheDocument();
    });
    expect(screen.getByText('Hãy chọn ngày')).toBeInTheDocument();
    expect(screen.getByText('Hãy chọn thời hạn')).toBeInTheDocument();
    expect(screen.getByText('Lý do tối thiểu 10 ký tự')).toBeInTheDocument();
    expect(screen.getAllByRole('alert')).toHaveLength(4);
  });

  it('điền hợp lệ thì action được gọi 1 lần và FormData có đúng bookId, term, quantity', async () => {
    const user = userEvent.setup();
    const action = vi.fn(
      async (_prevState: LoanFormState, _formData: FormData): Promise<LoanFormState> => ({
        errors: {},
        values: {},
        message: 'Đã gửi yêu cầu, chờ duyệt',
        ok: true,
      }),
    );

    render(<LoanForm books={books} action={action} />);

    await user.selectOptions(screen.getByLabelText('Sách'), '1');
    fireEvent.change(screen.getByLabelText('Ngày lấy sách'), {
      target: { value: '2026-12-10' },
    });
    await user.selectOptions(screen.getByLabelText('Thời hạn mượn'), '14');
    fireEvent.change(screen.getByLabelText('Số quyển'), { target: { value: '1' } });
    await user.type(screen.getByLabelText('Lý do mượn'), 'Cần đọc để làm bài tập lớn');

    fireEvent.submit(screen.getByRole('button', { name: 'Gửi yêu cầu' }).closest('form')!);

    await waitFor(() => expect(action).toHaveBeenCalledTimes(1));
    const formData = action.mock.calls[0][1] as FormData;
    expect(formData.get('bookId')).toBe('1');
    expect(formData.get('term')).toBe('14');
    expect(formData.get('quantity')).toBe('1');
  });

  it('action trả message hết bản cùng values thì thông báo hiện và lý do vẫn còn', async () => {
    const action = vi.fn(async (): Promise<LoanFormState> => ({
      errors: {},
      values: {
        bookId: '6',
        pickupDate: '2026-12-02',
        term: '14',
        quantity: '1',
        reason: 'Ôn tập an toàn mạng cuối kỳ',
      },
      message: 'Sách đã hết bản vào ngày này',
      ok: false,
    }));

    render(<LoanForm books={books} action={action} />);
    fireEvent.submit(screen.getByRole('button', { name: 'Gửi yêu cầu' }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Sách đã hết bản vào ngày này')).toBeInTheDocument();
      expect(screen.getByLabelText('Lý do mượn')).toHaveValue(
        'Ôn tập an toàn mạng cuối kỳ',
      );
    });
  });

  it('có defaultBookId thì ô Sách được chọn sẵn', () => {
    render(<LoanForm books={books} defaultBookId={6} action={vi.fn()} />);
    expect(screen.getByLabelText('Sách')).toHaveValue('6');
  });
});
