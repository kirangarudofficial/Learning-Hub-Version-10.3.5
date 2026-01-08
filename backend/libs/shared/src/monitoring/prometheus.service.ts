import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as client from 'prom-client';

@Injectable()
export class PrometheusService implements OnModuleInit {
  private readonly register: client.Registry;
  private readonly prefix: string;

  // HTTP metrics
  private httpRequestsTotal: client.Counter;
  private httpRequestDuration: client.Histogram;
  private httpRequestSize: client.Summary;
  private httpResponseSize: client.Summary;
  private httpRequestsInProgress: client.Gauge;

  // Database metrics
  private dbQueryDuration: client.Histogram;
  private dbConnectionsTotal: client.Gauge;
  private dbQueriesTotal: client.Counter;

  // Service metrics
  private serviceUptime: client.Gauge;
  private serviceInfo: client.Gauge;

  // Business metrics
  private userRegistrationsTotal: client.Counter;
  private courseEnrollmentsTotal: client.Counter;
  private courseCompletionsTotal: client.Counter;

  constructor(private configService: ConfigService) {
    this.register = new client.Registry();
    this.prefix = this.configService.get('METRICS_PREFIX', 'learning_hub');

    // Add default metrics (memory, CPU, etc.)
    this.register.setDefaultLabels({
      app: this.configService.get('APP_NAME', 'learning_hub'),
      env: this.configService.get('NODE_ENV', 'development'),
    });
    client.collectDefaultMetrics({ register: this.register, prefix: `${this.prefix}_` });

    this.initializeMetrics();
  }

  onModuleInit() {
    // Start the service uptime counter
    this.serviceUptime.set(process.uptime());
    setInterval(() => {
      this.serviceUptime.set(process.uptime());
    }, 10000); // Update every 10 seconds
  }

  private initializeMetrics() {
    // HTTP metrics
    this.httpRequestsTotal = new client.Counter({
      name: `${this.prefix}_http_requests_total`,
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
      registers: [this.register],
    });

    this.httpRequestDuration = new client.Histogram({
      name: `${this.prefix}_http_request_duration_seconds`,
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
      registers: [this.register],
    });

    this.httpRequestSize = new client.Summary({
      name: `${this.prefix}_http_request_size_bytes`,
      help: 'HTTP request size in bytes',
      labelNames: ['method', 'route'],
      registers: [this.register],
    });

    this.httpResponseSize = new client.Summary({
      name: `${this.prefix}_http_response_size_bytes`,
      help: 'HTTP response size in bytes',
      labelNames: ['method', 'route'],
      registers: [this.register],
    });

    this.httpRequestsInProgress = new client.Gauge({
      name: `${this.prefix}_http_requests_in_progress`,
      help: 'Number of HTTP requests in progress',
      labelNames: ['method', 'route'],
      registers: [this.register],
    });

    // Database metrics
    this.dbQueryDuration = new client.Histogram({
      name: `${this.prefix}_db_query_duration_seconds`,
      help: 'Database query duration in seconds',
      labelNames: ['operation', 'entity'],
      buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
      registers: [this.register],
    });

    this.dbConnectionsTotal = new client.Gauge({
      name: `${this.prefix}_db_connections_total`,
      help: 'Total number of database connections',
      registers: [this.register],
    });

    this.dbQueriesTotal = new client.Counter({
      name: `${this.prefix}_db_queries_total`,
      help: 'Total number of database queries',
      labelNames: ['operation', 'entity'],
      registers: [this.register],
    });

    // Service metrics
    this.serviceUptime = new client.Gauge({
      name: `${this.prefix}_service_uptime_seconds`,
      help: 'Service uptime in seconds',
      registers: [this.register],
    });

    this.serviceInfo = new client.Gauge({
      name: `${this.prefix}_service_info`,
      help: 'Service information',
      labelNames: ['version', 'name'],
      registers: [this.register],
    });

    // Set service info
    this.serviceInfo.labels(
      this.configService.get('APP_VERSION', '1.0.0'),
      this.configService.get('APP_NAME', 'learning_hub'),
    ).set(1);

    // Business metrics
    this.userRegistrationsTotal = new client.Counter({
      name: `${this.prefix}_user_registrations_total`,
      help: 'Total number of user registrations',
      registers: [this.register],
    });

    this.courseEnrollmentsTotal = new client.Counter({
      name: `${this.prefix}_course_enrollments_total`,
      help: 'Total number of course enrollments',
      labelNames: ['course_id'],
      registers: [this.register],
    });

    this.courseCompletionsTotal = new client.Counter({
      name: `${this.prefix}_course_completions_total`,
      help: 'Total number of course completions',
      labelNames: ['course_id'],
      registers: [this.register],
    });
  }

  // HTTP metrics methods
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestsTotal.inc({ method, route, status_code: statusCode.toString() });
    this.httpRequestDuration.observe({ method, route, status_code: statusCode.toString() }, duration);
  }

  startHttpRequest(method: string, route: string) {
    this.httpRequestsInProgress.inc({ method, route });
    return Date.now();
  }

  endHttpRequest(method: string, route: string, startTime: number) {
    const duration = (Date.now() - startTime) / 1000;
    this.httpRequestsInProgress.dec({ method, route });
    return duration;
  }

  recordHttpRequestSize(method: string, route: string, sizeInBytes: number) {
    this.httpRequestSize.observe({ method, route }, sizeInBytes);
  }

  recordHttpResponseSize(method: string, route: string, sizeInBytes: number) {
    this.httpResponseSize.observe({ method, route }, sizeInBytes);
  }

  // Database metrics methods
  recordDbQuery(operation: string, entity: string, duration: number) {
    this.dbQueriesTotal.inc({ operation, entity });
    this.dbQueryDuration.observe({ operation, entity }, duration);
  }

  setDbConnections(count: number) {
    this.dbConnectionsTotal.set(count);
  }

  // Business metrics methods
  incrementUserRegistrations() {
    this.userRegistrationsTotal.inc();
  }

  incrementCourseEnrollments(courseId: string) {
    this.courseEnrollmentsTotal.inc({ course_id: courseId });
  }

  incrementCourseCompletions(courseId: string) {
    this.courseCompletionsTotal.inc({ course_id: courseId });
  }

  // Get metrics for endpoint
  async getMetrics(): Promise<string> {
    return this.register.metrics();
  }

  async getContentType(): Promise<string> {
    return this.register.contentType;
  }
}