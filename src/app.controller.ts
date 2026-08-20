import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * API health check
   *
   * Because main.ts uses:
   * app.setGlobalPrefix('api')
   *
   * This endpoint becomes:
   * GET /api
   */
  @Get()
  getHello() {
    return {
      success: true,
      message: 'Task Management API is running',
      data: this.appService.getHello(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Health check endpoint
   *
   * URL:
   * GET /api/health
   */
  @Get('health')
  healthCheck() {
    return {
      success: true,
      message: 'Task Management API is healthy',
      timestamp: new Date().toISOString(),
    };
  }
}