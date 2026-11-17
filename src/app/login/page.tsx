import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }> | {
    callbackUrl?: string;
    error?: string;
  };
}) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || '/loans';

  async function loginAction(formData: FormData) {
    'use server';
    try {
      await signIn('credentials', {
        email: String(formData.get('email') ?? ''),
        password: String(formData.get('password') ?? ''),
        redirectTo: callbackUrl,
      });
    } catch (error) {
      if (error instanceof AuthError) {
        redirect(`/login?error=CredentialsSignin&callbackUrl=${encodeURIComponent(callbackUrl)}`);
      }
      throw error;
    }
  }

  return (
    <div className="p-6 max-w-lg space-y-4">
      <h1 className="text-2xl font-bold">Đăng nhập</h1>
      {params.error && (
        <p role="alert" className="text-red-600">
          Email hoặc mật khẩu không đúng
        </p>
      )}
      <form action={loginAction} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium">
            Email
          </label>
          <input id="email" name="email" type="email" required className="border p-2 w-full" />
        </div>
        <div>
          <label htmlFor="password" className="block font-medium">
            Mật khẩu
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Đăng nhập
        </button>
      </form>
      <p className="text-sm">
        sv01@st.hcmuaf.edu.vn / 123456 · admin@hcmuaf.edu.vn / admin123
      </p>
    </div>
  );
}
