'use client';

import { Suspense, useEffect, useState } from 'react';
import { signIn, getSession, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

type Step = 'credentials' | '2fa';

function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const { update } = useSession();
  const callbackUrl = params.get('callbackUrl') || '/admin';
  const [step, setStep] = useState<Step>(params.get('step') === '2fa' ? '2fa' : 'credentials');
  const [email, setEmail] = useState('admin@burgerking.it');
  const [password, setPassword] = useState('admin');
  const [totp, setTotp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const err = params.get('error');
    if (err === 'CredentialsSignin') {
      setError('Email ou password incorretos. Use admin@burgerking.it / admin');
    }
  }, [params]);

  useEffect(() => {
    if (params.get('step') === '2fa') setStep('2fa');
  }, [params]);

  async function afterAuth() {
    const session = await getSession();
    const needs2fa =
      session?.user?.role === 'admin' &&
      (session as { twoFactorVerified?: boolean }).twoFactorVerified === false;
    if (needs2fa) {
      setStep('2fa');
      return;
    }
    router.push(callbackUrl);
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email: email.trim().toLowerCase(),
      password,
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError('Email ou password incorretos. Use admin@burgerking.it / admin');
      return;
    }
    await afterAuth();
  }

  async function handle2fa(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: totp.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error === 'Too many attempts' ? 'Muitas tentativas — aguarde 1 minuto' : 'Código inválido');
        setLoading(false);
        return;
      }
      await update({ twoFactorVerified: true });
      router.push(callbackUrl);
    } catch {
      setError('Erro de rede — tente novamente');
      setLoading(false);
    }
  }

  if (step === '2fa') {
    return (
      <div className="container-1600 py-12 flex justify-center">
        <form className="admin-form w-full max-w-md" onSubmit={handle2fa}>
          <h1 className="text-2xl font-bold text-center">Verificação 2FA</h1>
          <p className="text-sm text-center opacity-80">
            Insira o código de 6 dígitos do Google Authenticator
          </p>
          {error && <p className="admin-error">{error}</p>}
          <label>
            Código TOTP
            <input
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              value={totp}
              onChange={(e) => setTotp(e.target.value.replace(/\D/g, ''))}
              required
              autoComplete="one-time-code"
              disabled={loading}
              autoFocus
            />
          </label>
          <button type="submit" className="btn-main w-full" disabled={loading || totp.length !== 6}>
            {loading ? 'Verificando...' : 'Confirmar e entrar'}
          </button>
          <button
            type="button"
            className="btn-main w-full opacity-70"
            style={{ marginTop: '0.5rem', background: 'transparent', border: '1px solid #ccc' }}
            onClick={() => setStep('credentials')}
          >
            Voltar ao login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="container-1600 py-12 flex justify-center">
      <form className="admin-form w-full max-w-md" onSubmit={handleCredentials}>
        <h1 className="text-2xl font-bold text-center">Accedi — Admin BK</h1>
        <p className="text-sm text-center">
          Demo: <strong>admin@burgerking.it</strong> / <strong>admin</strong>
        </p>
        {error && <p className="admin-error">{error}</p>}
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            disabled={loading}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
          />
        </label>
        <button type="submit" className="btn-main w-full" disabled={loading}>
          {loading ? 'Accesso...' : 'Entra no Admin'}
        </button>
        <p className="text-sm text-center opacity-70">
          Destino após login: <strong>{callbackUrl}</strong>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-1600 py-12 text-center">Caricamento...</div>}>
      <LoginForm />
    </Suspense>
  );
}