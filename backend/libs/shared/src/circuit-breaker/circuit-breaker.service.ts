import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation, requests pass through
  OPEN = 'OPEN',         // Circuit is open, requests fail fast
  HALF_OPEN = 'HALF_OPEN', // Testing if service is back online
}

interface CircuitBreakerOptions {
  failureThreshold: number;      // Number of failures before opening circuit
  resetTimeout: number;          // Time in ms before attempting reset (half-open)
  halfOpenSuccessThreshold: number; // Successes needed in half-open to close
  requestTimeout: number;        // Timeout for requests in ms
}

interface CircuitBreakerStats {
  state: CircuitState;
  failures: number;
  successes: number;
  lastFailure: Date | null;
  lastSuccess: Date | null;
  lastStateChange: Date;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  rejectedRequests: number;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private circuits: Map<string, {
    state: CircuitState;
    failures: number;
    successes: number;
    lastFailure: Date | null;
    lastSuccess: Date | null;
    lastStateChange: Date;
    resetTimeout: NodeJS.Timeout | null;
    options: CircuitBreakerOptions;
    stats: CircuitBreakerStats;
  }> = new Map();

  private defaultOptions: CircuitBreakerOptions = {
    failureThreshold: 5,
    resetTimeout: 30000, // 30 seconds
    halfOpenSuccessThreshold: 2,
    requestTimeout: 5000, // 5 seconds
  };

  constructor(private configService: ConfigService) {
    // Load config from environment if available
    this.defaultOptions = {
      failureThreshold: this.configService.get('CIRCUIT_BREAKER_FAILURE_THRESHOLD', 5),
      resetTimeout: this.configService.get('CIRCUIT_BREAKER_RESET_TIMEOUT', 30000),
      halfOpenSuccessThreshold: this.configService.get('CIRCUIT_BREAKER_HALF_OPEN_SUCCESS_THRESHOLD', 2),
      requestTimeout: this.configService.get('CIRCUIT_BREAKER_REQUEST_TIMEOUT', 5000),
    };
  }

  /**
   * Register a new circuit breaker
   * @param serviceId Unique identifier for the service
   * @param options Optional custom circuit breaker options
   */
  registerCircuit(serviceId: string, options?: Partial<CircuitBreakerOptions>): void {
    if (this.circuits.has(serviceId)) {
      this.logger.warn(`Circuit breaker for service ${serviceId} already exists`);
      return;
    }

    const circuitOptions = { ...this.defaultOptions, ...options };
    const now = new Date();
    
    const stats: CircuitBreakerStats = {
      state: CircuitState.CLOSED,
      failures: 0,
      successes: 0,
      lastFailure: null,
      lastSuccess: null,
      lastStateChange: now,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      rejectedRequests: 0,
    };

    this.circuits.set(serviceId, {
      state: CircuitState.CLOSED,
      failures: 0,
      successes: 0,
      lastFailure: null,
      lastSuccess: null,
      lastStateChange: now,
      resetTimeout: null,
      options: circuitOptions,
      stats,
    });

    this.logger.log(`Circuit breaker registered for service ${serviceId}`);
  }

  /**
   * Execute a function with circuit breaker protection
   * @param serviceId The service identifier
   * @param fn The function to execute
   * @returns The result of the function or throws an error
   */
  async execute<T>(serviceId: string, fn: () => Promise<T>): Promise<T> {
    const circuit = this.circuits.get(serviceId);
    
    if (!circuit) {
      this.logger.warn(`No circuit breaker found for service ${serviceId}, registering with default options`);
      this.registerCircuit(serviceId);
      return this.execute(serviceId, fn);
    }

    circuit.stats.totalRequests++;

    // Check if circuit is open
    if (circuit.state === CircuitState.OPEN) {
      circuit.stats.rejectedRequests++;
      throw new Error(`Circuit for service ${serviceId} is OPEN`);
    }

    try {
      // Execute with timeout
      const result = await this.executeWithTimeout(fn, circuit.options.requestTimeout);
      
      // Handle success
      this.onSuccess(serviceId);
      circuit.stats.successfulRequests++;
      return result;
    } catch (error) {
      // Handle failure
      this.onFailure(serviceId, error);
      circuit.stats.failedRequests++;
      throw error;
    }
  }

  /**
   * Get the current state of a circuit
   * @param serviceId The service identifier
   * @returns The current circuit state or null if not found
   */
  getState(serviceId: string): CircuitState | null {
    return this.circuits.get(serviceId)?.state || null;
  }

  /**
   * Get statistics for a circuit
   * @param serviceId The service identifier
   * @returns Circuit statistics or null if not found
   */
  getStats(serviceId: string): CircuitBreakerStats | null {
    return this.circuits.get(serviceId)?.stats || null;
  }

  /**
   * Reset a circuit to closed state
   * @param serviceId The service identifier
   */
  resetCircuit(serviceId: string): void {
    const circuit = this.circuits.get(serviceId);
    if (!circuit) return;

    // Clear any pending reset timeout
    if (circuit.resetTimeout) {
      clearTimeout(circuit.resetTimeout);
      circuit.resetTimeout = null;
    }

    // Reset to closed state
    circuit.state = CircuitState.CLOSED;
    circuit.failures = 0;
    circuit.successes = 0;
    circuit.lastStateChange = new Date();
    
    // Update stats
    circuit.stats.state = CircuitState.CLOSED;
    circuit.stats.failures = 0;
    circuit.stats.successes = 0;
    circuit.stats.lastStateChange = new Date();

    this.logger.log(`Circuit for service ${serviceId} manually reset to CLOSED`);
  }

  /**
   * Handle successful execution
   * @param serviceId The service identifier
   */
  private onSuccess(serviceId: string): void {
    const circuit = this.circuits.get(serviceId);
    if (!circuit) return;

    const now = new Date();
    circuit.lastSuccess = now;
    circuit.stats.lastSuccess = now;

    if (circuit.state === CircuitState.HALF_OPEN) {
      circuit.successes++;
      circuit.stats.successes++;

      // Check if we've reached the threshold to close the circuit
      if (circuit.successes >= circuit.options.halfOpenSuccessThreshold) {
        this.transitionToState(serviceId, CircuitState.CLOSED);
      }
    }
  }

  /**
   * Handle execution failure
   * @param serviceId The service identifier
   * @param error The error that occurred
   */
  private onFailure(serviceId: string, error: any): void {
    const circuit = this.circuits.get(serviceId);
    if (!circuit) return;

    const now = new Date();
    circuit.lastFailure = now;
    circuit.stats.lastFailure = now;

    if (circuit.state === CircuitState.HALF_OPEN) {
      // Any failure in half-open state opens the circuit again
      this.transitionToState(serviceId, CircuitState.OPEN);
    } else if (circuit.state === CircuitState.CLOSED) {
      circuit.failures++;
      circuit.stats.failures++;

      // Check if we've reached the threshold to open the circuit
      if (circuit.failures >= circuit.options.failureThreshold) {
        this.transitionToState(serviceId, CircuitState.OPEN);
      }
    }

    this.logger.warn(`Circuit breaker failure for service ${serviceId}: ${error.message}`);
  }

  /**
   * Transition a circuit to a new state
   * @param serviceId The service identifier
   * @param newState The new state to transition to
   */
  private transitionToState(serviceId: string, newState: CircuitState): void {
    const circuit = this.circuits.get(serviceId);
    if (!circuit) return;

    const oldState = circuit.state;
    const now = new Date();

    // Update state
    circuit.state = newState;
    circuit.lastStateChange = now;
    circuit.stats.state = newState;
    circuit.stats.lastStateChange = now;

    this.logger.log(`Circuit for service ${serviceId} transitioned from ${oldState} to ${newState}`);

    // Handle state-specific actions
    if (newState === CircuitState.OPEN) {
      // Clear any existing timeout
      if (circuit.resetTimeout) {
        clearTimeout(circuit.resetTimeout);
      }

      // Schedule reset to half-open after timeout
      circuit.resetTimeout = setTimeout(() => {
        this.transitionToState(serviceId, CircuitState.HALF_OPEN);
      }, circuit.options.resetTimeout);
    } else if (newState === CircuitState.CLOSED) {
      // Reset counters
      circuit.failures = 0;
      circuit.successes = 0;
      circuit.stats.failures = 0;
      circuit.stats.successes = 0;
    } else if (newState === CircuitState.HALF_OPEN) {
      // Reset success counter for half-open state
      circuit.successes = 0;
      circuit.stats.successes = 0;
    }
  }

  /**
   * Execute a function with a timeout
   * @param fn The function to execute
   * @param timeoutMs Timeout in milliseconds
   * @returns The result of the function or throws a timeout error
   */
  private async executeWithTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error(`Operation timed out after ${timeoutMs}ms`));
      }, timeoutMs);

      fn()
        .then((result) => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          reject(error);
        });
    });
  }
}