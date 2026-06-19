import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/db';
import { ProductDetailClient } from './ProductDetailClient';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  return <ProductDetailClient product={product} />;
}