import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const adminEmails = (process.env.ADMIN_EMAILS || 'admin@burgerking.it')
  .split(',')
  .map((e) => e.trim().toLowerCase());

export const authOptions: NextAuthOptions = {
  useSecureCookies: process.env.NEXTAUTH_URL?.startsWith('https://') ?? false,
  providers: [
    CredentialsProvider({
      name: 'Demo',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = credentials.email.toLowerCase();
        // Demo: password "admin" para emails em ADMIN_EMAILS
        if (adminEmails.includes(email) && credentials.password === 'admin') {
          return { id: email, email, name: 'Admin BK', role: 'admin' };
        }
        if (credentials.password === 'demo') {
          return { id: email, email, name: email.split('@')[0], role: 'customer' };
        }
        return null;
      },
    }),
    // Azure AD B2C: adicionar AzureADB2CProvider quando AZURE_AD_B2C_CLIENT_ID estiver definido
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as { role?: string }).role || 'customer';
        token.refreshIssuedAt = Date.now();
        // PEN-TEST: 2FA gate — token só válido após verificação TOTP
        const { is2faEnabled } = await import('./security/totp');
        token.twoFactorVerified = !is2faEnabled() || (user as { twoFactorVerified?: boolean }).twoFactorVerified === true;
      }
      if (trigger === 'update' && session?.twoFactorVerified) {
        token.twoFactorVerified = true;
      }
      // Refresh token rotation: re-emite a cada 24h
      const issued = (token.refreshIssuedAt as number) || 0;
      if (Date.now() - issued > 24 * 60 * 60 * 1000) {
        token.refreshIssuedAt = Date.now();
        token.iat = Math.floor(Date.now() / 1000);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session as { twoFactorVerified?: boolean }).twoFactorVerified = Boolean(token.twoFactorVerified);
      }
      return session;
    },
  },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60, updateAge: 60 * 60 },
  pages: { signIn: '/auth/login' },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export function isAdmin(session: { user?: { email?: string | null; role?: string } } | null) {
  if (!session?.user) return false;
  if (session.user.role === 'admin') return true;
  return adminEmails.includes((session.user.email || '').toLowerCase());
}