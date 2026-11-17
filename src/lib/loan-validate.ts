export interface LoanInput {
  bookId: string;
  pickupDate: string;
  term: string;
  quantity: string;
  reason: string;
}

export interface LoanData {
  bookId: number;
  pickupDate: string;
  term: 7 | 14 | 30;
  quantity: number;
  reason: string;
}

export type LoanErrors = Partial<Record<keyof LoanInput, string>>;

export interface LoanFormState {
  errors: LoanErrors;
  values: Partial<LoanInput>;
  message?: string;
  ok?: boolean;
}

export function today(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

type RawLoanFields = {
  bookId?: FormDataEntryValue | null;
  pickupDate?: FormDataEntryValue | null;
  term?: FormDataEntryValue | null;
  quantity?: FormDataEntryValue | null;
  reason?: FormDataEntryValue | null;
};

function readField(
  raw: FormData | RawLoanFields,
  key: keyof LoanInput,
): string {
  const value = raw instanceof FormData ? raw.get(key) : raw[key];
  if (value === undefined || value === null) return '';
  return String(value);
}

/** Đổi object/FormData thành LoanInput; thiếu trường → chuỗi rỗng. */
export function toLoanInput(raw: FormData | RawLoanFields | null | undefined): LoanInput {
  if (!raw) {
    return { bookId: '', pickupDate: '', term: '', quantity: '', reason: '' };
  }
  return {
    bookId: readField(raw, 'bookId'),
    pickupDate: readField(raw, 'pickupDate'),
    term: readField(raw, 'term'),
    quantity: readField(raw, 'quantity'),
    reason: readField(raw, 'reason'),
  };
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateLoan(
  input: LoanInput,
  books: Array<{ id: number; stock: number }>,
): LoanErrors {
  const errors: LoanErrors = {};

  const bookIdNum = Number(input.bookId);
  const selectedBook = books.find((b) => b.id === bookIdNum);
  if (!input.bookId || Number.isNaN(bookIdNum) || !selectedBook) {
    errors.bookId = 'Hãy chọn sách';
  }

  if (!input.pickupDate) {
    errors.pickupDate = 'Hãy chọn ngày';
  } else if (!DATE_RE.test(input.pickupDate) || input.pickupDate < today()) {
    // Sai định dạng hoặc ở quá khứ → cùng thông báo quá khứ theo bảng kiểm tra
    if (!DATE_RE.test(input.pickupDate)) {
      errors.pickupDate = 'Hãy chọn ngày';
    } else {
      errors.pickupDate = 'Ngày lấy sách không được ở quá khứ';
    }
  }

  const termNum = Number(input.term);
  if (termNum !== 7 && termNum !== 14 && termNum !== 30) {
    errors.term = 'Hãy chọn thời hạn';
  }

  const qtyNum = Number(input.quantity);
  if (!Number.isInteger(qtyNum) || qtyNum < 1) {
    errors.quantity = 'Số quyển phải từ 1 trở lên';
  } else if (selectedBook && qtyNum > selectedBook.stock) {
    errors.quantity = `Vượt số bản của sách (${selectedBook.stock} bản)`;
  }

  if ((input.reason ?? '').trim().length < 10) {
    errors.reason = 'Lý do tối thiểu 10 ký tự';
  }

  return errors;
}

/** Chỉ gọi khi validateLoan không còn lỗi. */
export function toLoanData(input: LoanInput): LoanData {
  return {
    bookId: Number(input.bookId),
    pickupDate: input.pickupDate,
    term: Number(input.term) as 7 | 14 | 30,
    quantity: Number(input.quantity),
    reason: input.reason.trim(),
  };
}
