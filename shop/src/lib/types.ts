export type Product = {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  thumb_url: string | null;
  main_image_url: string | null;
  hero_image_url: string | null;
  price_cents: number;
  currency: string;
  is_active: boolean;
  is_featured: boolean;
  metadata_json?: string | null;
  categories?: string[];
};

export type CartItem = {
  productId: number;
  slug: string;
  title: string;
  thumb_url: string | null;
  quantity: number;
  unit_price_cents: number;
};

export type Order = {
  id: string;
  order_number: string;
  email: string;
  status: string;
  total_cents: number;
  currency: string;
  items: OrderItem[];
};

export type OrderItem = {
  product_title: string;
  product_slug: string;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
};

export type SiteSettings = {
  site_name: string;
  currency: string;
  logo_url: string;
  support_email: string;
};

export type OrderRow = {
  id: string;
  order_number: string;
  email: string;
  status: string;
  total_cents: number;
  currency: string;
  payment_provider: string | null;
  created_at: string;
  paid_at: string | null;
  item_count?: number;
};

export type ProductInput = {
  slug: string;
  title: string;
  description?: string;
  thumb_url?: string;
  main_image_url?: string;
  hero_image_url?: string;
  price_cents: number;
  is_active?: boolean;
  is_featured?: boolean;
  category_keys?: string[];
};