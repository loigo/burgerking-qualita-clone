import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminApi } from '@/lib/security/api-guard';
import { testPaymentGateway } from '@/lib/payments-test';

const schema = z.object({
  gateway: z.enum(['stripe', 'paypal', 'satispay']),
  stripe: z
    .object({
      pk: z.string().optional(),
      sk: z.string().optional(),
      webhook: z.string().optional(),
    })
    .optional(),
  paypal: z
    .object({
      clientId: z.string().optional(),
      secret: z.string().optional(),
    })
    .optional(),
  satispay: z
    .object({
      keyId: z.string().optional(),
      privateKey: z.string().optional(),
    })
    .optional(),
});

/**
 * PEN-TEST: credenciais do body são usadas só para teste em memória.
 * Não são persistidas — salvar apenas em .env.local no servidor.
 */
export async function POST(req: Request) {
  const body = schema.parse(await req.json());
  const { error } = await requireAdminApi(req, {
    audit: { action: 'test_connection', entity: 'payment', entity_id: body.gateway },
  });
  if (error) return error;

  const result = await testPaymentGateway(body.gateway, {
    stripe: body.stripe,
    paypal: body.paypal,
    satispay: body.satispay,
  });

  return NextResponse.json(result, { status: result.ok ? 200 : 422 });
}