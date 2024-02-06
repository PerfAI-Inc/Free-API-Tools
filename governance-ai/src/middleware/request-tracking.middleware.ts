// src/middleware/request-tracking.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RequestTrackingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const logsDir = path.join(__dirname, '..', 'logs');
    const logFilePath = path.join(logsDir, 'access.log');
    const logEntry = `${new Date().toISOString()}, ${req.ip}, ${req.method}, ${req.originalUrl}\n`;

    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    console.log(logEntry.trim());

    fs.appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error('Logging to file failed:', err);
      }
    });

    next();
  }
}
