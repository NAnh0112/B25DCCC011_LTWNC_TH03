import { describe, it, expect } from 'vitest';
import { can } from './permissions';

describe('permissions', () => {
  it('khách chỉ có quyền book:view', () => {
    expect(can('guest', 'book:view')).toBe(true);
    expect(can('guest', 'loan:create')).toBe(false);
    expect(can('guest', 'loan:review')).toBe(false);
  });

  it('student gửi được yêu cầu mượn nhưng không có loan:review', () => {
    expect(can('student', 'book:view')).toBe(true);
    expect(can('student', 'loan:create')).toBe(true);
    expect(can('student', 'loan:review')).toBe(false);
  });

  it('admin duyệt được (loan:review) nhưng không có loan:create', () => {
    expect(can('admin', 'book:view')).toBe(true);
    expect(can('admin', 'loan:review')).toBe(true);
    expect(can('admin', 'loan:create')).toBe(false);
  });
});
