import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/api-auth';
import { isBlobConfigured, uploadProductImage } from '@/lib/azure/blob';

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: 'AZURE_STORAGE_CONNECTION_STRING non configurato.' },
      { status: 503 }
    );
  }
  const form = await req.formData();
  const file = form.get('file');
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: 'File mancante' }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  const name = (form.get('filename') as string) || `product-${Date.now()}.jpg`;
  const url = await uploadProductImage(name, buffer, file.type || 'image/jpeg');
  return NextResponse.json({ url });
}