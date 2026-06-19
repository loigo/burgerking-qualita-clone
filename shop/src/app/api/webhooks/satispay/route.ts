import { NextResponse } from 'next/server';
import { processSatispayCallback } from '@/lib/satispay-callback';

/** Satispay S2S callback — GET com ?payment_id={uuid} */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const paymentId = url.searchParams.get('payment_id');
  if (!paymentId) {
    return NextResponse.json({ error: 'payment_id required' }, { status: 400 });
  }

  try {
    const result = await processSatispayCallback(paymentId);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Satispay callback failed' },
      { status: 500 }
    );
  }
}