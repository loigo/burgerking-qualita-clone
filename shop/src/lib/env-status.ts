export type EnvStatus = {
  database: boolean;
  nextauth: boolean;
  stripe: boolean;
  paypal: boolean;
  satispay: boolean;
  meta: boolean;
  gtm: boolean;
  ga4: boolean;
  azureBlob: boolean;
  appInsights: boolean;
};

export function getEnvStatus(): EnvStatus {
  return {
    database: Boolean(process.env.DATABASE_URL),
    nextauth: Boolean(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL),
    stripe: Boolean(
      process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    ),
    paypal: Boolean(
      process.env.PAYPAL_CLIENT_ID &&
        process.env.PAYPAL_CLIENT_SECRET &&
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
    ),
    satispay: Boolean(process.env.SATISPAY_KEY_ID && process.env.SATISPAY_PRIVATE_KEY),
    meta: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
    gtm: Boolean(process.env.NEXT_PUBLIC_GTM_ID),
    ga4: Boolean(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID),
    azureBlob: Boolean(process.env.AZURE_STORAGE_CONNECTION_STRING),
    appInsights: Boolean(process.env.APPLICATIONINSIGHTS_CONNECTION_STRING),
  };
}

export function countReady(status: EnvStatus, dbConnected: boolean) {
  const checks = [
    dbConnected,
    status.nextauth,
    status.stripe,
    status.paypal,
    status.satispay,
    status.meta,
    status.gtm,
    status.ga4,
  ];
  return checks.filter(Boolean).length;
}