'use client';

import React, { useRef, useState, useTransition } from 'react';
import type { LoanFormState } from '@/lib/loan-validate';
import { TERM_LABEL } from '@/types';

interface LoanFormProps {
  books: Array<{ id: number; title: string; stock: number }>;
  defaultBookId?: number;
  action: (prev: LoanFormState, formData: FormData) => Promise<LoanFormState>;
}

/** Tương đương useActionState: [state, formAction, isPending] */
function useActionState(
  action: (prev: LoanFormState, formData: FormData) => Promise<LoanFormState>,
  initial: LoanFormState,
): [LoanFormState, (payload: FormData) => void, boolean] {
  const [state, setState] = useState(initial);
  const stateRef = useRef(state);
  stateRef.current = state;
  const [isPending, startTransition] = useTransition();

  const formAction = (formData: FormData) => {
    startTransition(async () => {
      const next = await action(stateRef.current, formData);
      setState(next);
    });
  };

  return [state, formAction, isPending];
}

export default function LoanForm({ books, defaultBookId, action }: LoanFormProps) {
  const initialBookId = defaultBookId ? String(defaultBookId) : '';
  const [state, formAction, isPending] = useActionState(action, {
    errors: {},
    values: initialBookId ? { bookId: initialBookId } : {},
  });

  const values = state.values ?? {};
  const bookValue = values.bookId ?? initialBookId;
  const formKey = JSON.stringify({ ...values, _msg: state.message, _ok: state.ok });

  return (
    <form
      key={formKey}
      action={formAction}
      onSubmit={(e) => {
        e.preventDefault();
        formAction(new FormData(e.currentTarget));
      }}
      className="space-y-4 max-w-lg"
    >
      <div>
        <label htmlFor="bookId" className="block font-medium">
          Sách
        </label>
        <select
          id="bookId"
          name="bookId"
          defaultValue={bookValue}
          className="border p-2 w-full"
        >
          <option value="">-- Chọn sách --</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} ({b.stock} bản)
            </option>
          ))}
        </select>
        {state.errors.bookId && (
          <p role="alert" className="text-red-500 text-sm">
            {state.errors.bookId}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="pickupDate" className="block font-medium">
          Ngày lấy sách
        </label>
        <input
          type="date"
          id="pickupDate"
          name="pickupDate"
          defaultValue={values.pickupDate ?? ''}
          className="border p-2 w-full"
        />
        {state.errors.pickupDate && (
          <p role="alert" className="text-red-500 text-sm">
            {state.errors.pickupDate}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="term" className="block font-medium">
          Thời hạn mượn
        </label>
        <select
          id="term"
          name="term"
          defaultValue={values.term ?? ''}
          className="border p-2 w-full"
        >
          <option value="">-- Chọn thời hạn --</option>
          <option value="7">{TERM_LABEL[7]}</option>
          <option value="14">{TERM_LABEL[14]}</option>
          <option value="30">{TERM_LABEL[30]}</option>
        </select>
        {state.errors.term && (
          <p role="alert" className="text-red-500 text-sm">
            {state.errors.term}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="quantity" className="block font-medium">
          Số quyển
        </label>
        <input
          type="number"
          id="quantity"
          name="quantity"
          defaultValue={values.quantity ?? '1'}
          className="border p-2 w-full"
        />
        {state.errors.quantity && (
          <p role="alert" className="text-red-500 text-sm">
            {state.errors.quantity}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="reason" className="block font-medium">
          Lý do mượn
        </label>
        <textarea
          id="reason"
          name="reason"
          defaultValue={values.reason ?? ''}
          className="border p-2 w-full"
        />
        {state.errors.reason && (
          <p role="alert" className="text-red-500 text-sm">
            {state.errors.reason}
          </p>
        )}
      </div>

      {state.message && (
        <p
          role="status"
          className={state.ok ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}
        >
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Gửi yêu cầu
      </button>
    </form>
  );
}
