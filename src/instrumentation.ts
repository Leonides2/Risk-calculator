import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({
    serviceName: 'risk-calculator',
    traceExporter: new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      headers: {
        Authorization: process.env.OTEL_EXPORTER_OTLP_HEADERS || '',
        
      },
    }),
  });
}
