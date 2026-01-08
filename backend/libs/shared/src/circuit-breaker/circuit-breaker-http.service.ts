import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CircuitBreakerService } from './circuit-breaker.service';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CircuitBreakerHttpService {
  private readonly logger = new Logger(CircuitBreakerHttpService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly circuitBreakerService: CircuitBreakerService,
  ) {}

  /**
   * Make a GET request with circuit breaker protection
   * @param serviceId Unique identifier for the service
   * @param url The URL to request
   * @param config Optional Axios request configuration
   * @returns The Axios response
   */
  async get<T = any>(serviceId: string, url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.circuitBreakerService.execute(serviceId, async () => {
      return firstValueFrom(this.httpService.get<T>(url, config));
    });
  }

  /**
   * Make a POST request with circuit breaker protection
   * @param serviceId Unique identifier for the service
   * @param url The URL to request
   * @param data The data to send
   * @param config Optional Axios request configuration
   * @returns The Axios response
   */
  async post<T = any>(serviceId: string, url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.circuitBreakerService.execute(serviceId, async () => {
      return firstValueFrom(this.httpService.post<T>(url, data, config));
    });
  }

  /**
   * Make a PUT request with circuit breaker protection
   * @param serviceId Unique identifier for the service
   * @param url The URL to request
   * @param data The data to send
   * @param config Optional Axios request configuration
   * @returns The Axios response
   */
  async put<T = any>(serviceId: string, url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.circuitBreakerService.execute(serviceId, async () => {
      return firstValueFrom(this.httpService.put<T>(url, data, config));
    });
  }

  /**
   * Make a PATCH request with circuit breaker protection
   * @param serviceId Unique identifier for the service
   * @param url The URL to request
   * @param data The data to send
   * @param config Optional Axios request configuration
   * @returns The Axios response
   */
  async patch<T = any>(serviceId: string, url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.circuitBreakerService.execute(serviceId, async () => {
      return firstValueFrom(this.httpService.patch<T>(url, data, config));
    });
  }

  /**
   * Make a DELETE request with circuit breaker protection
   * @param serviceId Unique identifier for the service
   * @param url The URL to request
   * @param config Optional Axios request configuration
   * @returns The Axios response
   */
  async delete<T = any>(serviceId: string, url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.circuitBreakerService.execute(serviceId, async () => {
      return firstValueFrom(this.httpService.delete<T>(url, config));
    });
  }

  /**
   * Make a HEAD request with circuit breaker protection
   * @param serviceId Unique identifier for the service
   * @param url The URL to request
   * @param config Optional Axios request configuration
   * @returns The Axios response
   */
  async head<T = any>(serviceId: string, url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.circuitBreakerService.execute(serviceId, async () => {
      return firstValueFrom(this.httpService.head<T>(url, config));
    });
  }

  /**
   * Make a request with circuit breaker protection
   * @param serviceId Unique identifier for the service
   * @param config Axios request configuration
   * @returns The Axios response
   */
  async request<T = any>(serviceId: string, config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.circuitBreakerService.execute(serviceId, async () => {
      return firstValueFrom(this.httpService.request<T>(config));
    });
  }
}