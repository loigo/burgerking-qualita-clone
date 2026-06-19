import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdmin } from '@/lib/api-auth';
import { getSiteSettings, isDbConfigured, updateSiteSettings } from '@/lib/db';

const schema = z.object({
  site_name: z.string().min(1).optional(),
  currency: z.string().min(3).max(3).optional(),
  logo_url: z.string().min(1).optional(),
  support_email: z.string().email().optional(),
});

export async function GET(req: Request) {
  const { error } = await requireAdmin(req);
  if (error) return error;
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const { error } = await requireAdmin(req, { action: 'update', entity: 'settings' });
  if (error) return error;
  if (!isDbConfigured()) {
    return NextResponse.json(
      { error: 'DATABASE_URL obrigatório para salvar configurações no banco.' },
      { status: 503 }
    );
  }
  const body = schema.parse(await req.json());
  const current = await getSiteSettings();
  const merged = { ...current, ...body };
  await updateSiteSettings(merged);
  return NextResponse.json(merged);
}