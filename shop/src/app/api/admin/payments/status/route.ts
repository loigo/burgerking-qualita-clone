import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/security/api-guard';
import { maskPaymentStatus } from '@/lib/payments-test';

/** PEN-TEST: retorna apenas chaves mascaradas — nunca expõe secrets completos */
export async function GET(req: Request) {
  const { error } = await requireAdminApi(req);
  if (error) return error;
  return NextResponse.json(maskPaymentStatus());
}