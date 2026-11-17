import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { users } from '@/data/users';
import type { Role } from '@/types';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? '');
        const password = String(credentials?.password ?? '');
        const user = users.find((u) => u.email === email && u.password === password);
        if (!user) return null;
        return {
          id: user.email,
          email: user.email,
          name: user.name,
          role: user.role as Role,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: Role }).role ?? 'guest';
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role as Role) ?? 'guest';
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  trustHost: true,
});
