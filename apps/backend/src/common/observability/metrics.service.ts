import { Injectable } from '@nestjs/common';
import { MetricAttributes, metrics } from '@opentelemetry/api';

@Injectable()
export class MetricsService {
  private readonly meter = metrics.getMeter('event-seat-booking-backend');
  private readonly bookingTraffic = this.meter.createCounter('booking_requests_total', {
    description: 'Total number of booking requests processed',
  });
  private readonly bookingErrors = this.meter.createCounter('booking_errors_total', {
    description: 'Total number of booking errors',
  });
  private readonly bookingLatency = this.meter.createHistogram('booking_latency_ms', {
    description: 'Latency for booking requests in milliseconds',
    unit: 'ms',
  });
  private readonly bookingSaturation = this.meter.createHistogram('booking_saturation_ratio', {
    description: 'Current saturation (booked seats / total seats) recorded per booking',
    unit: '1',
  });

  recordBookingRequest(attributes?: MetricAttributes): void {
    this.bookingTraffic.add(1, attributes);
  }

  recordBookingError(attributes?: MetricAttributes): void {
    this.bookingErrors.add(1, attributes);
  }

  recordBookingLatency(durationMs: number, attributes?: MetricAttributes): void {
    this.bookingLatency.record(durationMs, attributes);
  }

  recordBookingSaturation(ratio: number, attributes?: MetricAttributes): void {
    this.bookingSaturation.record(ratio, attributes);
  }
}
