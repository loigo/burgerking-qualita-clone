import 'next-auth';

declare module 'next-auth' {
  interface Session {
    twoFactorVerified?: boolean;
    user: {
      email?: string | null;
      name?: string | null;
      image?: string | null;
      role?: string;
    };
  }
  interface User {
    role?: string;
    twoFactorVerified?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    twoFactorVerified?: boolean;
    refreshIssuedAt?: number;
  }
}