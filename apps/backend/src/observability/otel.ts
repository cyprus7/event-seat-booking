import { metrics } from '@opentelemetry/api';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

let sdkInstance: NodeSDK | null = null;
let meterProviderInstance: MeterProvider | null = null;

export async function setupObservability(): Promise<void> {
  if (sdkInstance) {
    return;
  }

  const serviceName = process.env.OTEL_SERVICE_NAME || 'event-seat-booking-backend';
  const metricsPort = Number(process.env.METRICS_PORT ?? 9464);
  const metricsEndpoint = process.env.METRICS_ENDPOINT || '/metrics';
  const prometheusExporter = new PrometheusExporter({
    port: metricsPort,
    endpoint: metricsEndpoint,
  });

  const metricExporter = new OTLPMetricExporter({
    url: process.env.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT,
  });

  const traceExporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
  });

  const resource = resourceFromAttributes({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version ?? '1.0.0',
  });

  sdkInstance = new NodeSDK({
    resource,
    traceExporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  await sdkInstance.start();
  meterProviderInstance = new MeterProvider({
    resource,
    readers: [
      new PeriodicExportingMetricReader({ exporter: metricExporter }),
      prometheusExporter,
    ],
  });
  metrics.setGlobalMeterProvider(meterProviderInstance);
  prometheusExporter
    .startServer()
    .then(() =>
      console.log(`Prometheus metrics available at http://localhost:${metricsPort}${metricsEndpoint}`),
    )
    .catch(err => console.error('Failed to start Prometheus exporter', err));
  process.on('SIGTERM', () => {
    const shutdownTasks: Promise<unknown>[] = [];
    if (sdkInstance) {
      shutdownTasks.push(sdkInstance.shutdown());
    }
    if (meterProviderInstance) {
      shutdownTasks.push(meterProviderInstance.shutdown());
    }
    Promise.all(shutdownTasks)
      .then(() => console.log('OpenTelemetry SDK shut down'))
      .catch(err => console.error('Error shutting down OpenTelemetry SDK', err));
  });
}
