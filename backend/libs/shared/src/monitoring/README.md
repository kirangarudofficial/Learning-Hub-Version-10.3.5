# Monitoring and Circuit Breaker Implementation

## Overview

This module provides comprehensive monitoring and circuit breaker capabilities for the Learning Hub platform. It includes:

1. **Prometheus Metrics Collection** - Collects and exposes application metrics in Prometheus format
2. **Circuit Breaker Pattern** - Prevents cascading failures by detecting service failures and failing fast
3. **HTTP Client with Circuit Breaker** - HTTP client that integrates with the circuit breaker for external API calls

## Setup

### 1. Install Dependencies

The required dependencies have been added to the package.json:

```bash
npm install
```

### 2. Import the MonitoringModule

In your application module (e.g., main.ts or app.module.ts):

```typescript
import { MonitoringModule } from '@app/shared/monitoring/monitoring.module';

@Module({
  imports: [
    MonitoringModule.forRoot(),
    // other imports
  ],
})
export class AppModule {}
```

### 3. Configure Middleware

In your main.ts file:

```typescript
import { MetricsMiddleware } from '@app/shared/monitoring/metrics.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Apply metrics middleware
  app.use(app.get(MetricsMiddleware).use.bind(app.get(MetricsMiddleware)));
  
  await app.listen(3000);
}
```

## Usage

### Prometheus Metrics

The metrics are exposed at the `/metrics` endpoint. You can configure Prometheus to scrape this endpoint.

#### Available Metrics

- HTTP metrics (requests, duration, size)
- Database metrics (query duration, connections)
- Service metrics (uptime, info)
- Business metrics (user registrations, course enrollments, completions)
- Default Node.js metrics (memory, CPU)

#### Custom Metrics

You can record custom metrics by injecting the PrometheusService:

```typescript
import { PrometheusService } from '@app/shared/monitoring/prometheus.service';

@Injectable()
export class YourService {
  constructor(private prometheusService: PrometheusService) {}
  
  yourMethod() {
    // Record metrics
    this.prometheusService.incrementUserRegistrations();
  }
}
```

### Circuit Breaker

#### HTTP Requests with Circuit Breaker

```typescript
import { CircuitBreakerHttpService } from '@app/shared/circuit-breaker/circuit-breaker-http.service';

@Injectable()
export class YourService {
  constructor(private circuitBreakerHttp: CircuitBreakerHttpService) {}
  
  async callExternalApi() {
    try {
      const response = await this.circuitBreakerHttp.get(
        'external-api', // service identifier
        'https://api.example.com/data'
      );
      return response.data;
    } catch (error) {
      // Handle error
    }
  }
}
```

#### Manual Circuit Breaker

```typescript
import { CircuitBreakerService } from '@app/shared/circuit-breaker/circuit-breaker.service';

@Injectable()
export class YourService {
  constructor(private circuitBreaker: CircuitBreakerService) {}
  
  async performOperation() {
    try {
      return await this.circuitBreaker.execute('your-operation', async () => {
        // Your operation that might fail
        return await this.someRiskyOperation();
      });
    } catch (error) {
      // Handle error
    }
  }
}
```

## Grafana Dashboard

To visualize the metrics, you can set up Grafana with the following steps:

1. Install Prometheus and Grafana
2. Configure Prometheus to scrape the `/metrics` endpoint
3. Import the provided Grafana dashboard (see below)

### Sample Prometheus Configuration

```yaml
scrape_configs:
  - job_name: 'learning-hub'
    scrape_interval: 15s
    static_configs:
      - targets: ['localhost:3000']
```

### Sample Grafana Dashboard

A sample Grafana dashboard JSON is available in the `monitoring/dashboards` directory. You can import this dashboard into your Grafana instance.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|--------|
| METRICS_PREFIX | Prefix for all metrics | learning_hub |
| APP_NAME | Application name for metrics | learning_hub |
| APP_VERSION | Application version for metrics | 1.0.0 |
| NODE_ENV | Environment (development, production) | development |
| CIRCUIT_BREAKER_FAILURE_THRESHOLD | Number of failures before opening circuit | 5 |
| CIRCUIT_BREAKER_RESET_TIMEOUT | Time in ms before attempting reset | 30000 |
| CIRCUIT_BREAKER_HALF_OPEN_SUCCESS_THRESHOLD | Successes needed in half-open to close | 2 |
| CIRCUIT_BREAKER_REQUEST_TIMEOUT | Timeout for requests in ms | 5000 |