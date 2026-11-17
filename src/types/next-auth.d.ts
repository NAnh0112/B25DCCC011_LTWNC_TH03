import type { Role } from '@/types';
import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface User {
    role?: Role;
  }
  interface Session {
    user: {
      email?: string | null;
      name?: string | null;
      role?: Role;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: Role;
    email?: string | null;
  }
}
