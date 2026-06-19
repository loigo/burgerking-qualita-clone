/**
 * Application Insights — no Azure App Service a telemetria é coletada
 * automaticamente via APPLICATIONINSIGHTS_CONNECTION_STRING.
 * Eventos customizados são logados no servidor para debug/campanhas.
 */
export function initApplicationInsights() {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
    console.info('[Application Insights] connection string configured');
  }
}

export function trackEvent(name: string, properties?: Record<string, string>) {
  if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || process.env.NODE_ENV === 'development') {
    console.info(JSON.stringify({ event: name, properties, ts: new Date().toISOString() }));
  }
}