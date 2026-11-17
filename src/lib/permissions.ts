export type Role = 'guest' | 'student' | 'admin';
export type Permission = 'book:view' | 'loan:create' | 'loan:review';

const permissions: Record<Role, Permission[]> = {
  guest: ['book:view'],
  student: ['book:view', 'loan:create'],
  admin: ['book:view', 'loan:review'],
};

export function can(role: Role, permission: Permission): boolean {
  return permissions[role]?.includes(permission) ?? false;
}
