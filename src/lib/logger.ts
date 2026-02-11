/**
 * Structured Logger
 * Provides JSON-formatted logging with levels, context, and timestamps
 * 
 * Usage:
 * - logger.info('User created', { userId: 123, route: '/api/users' })
 * - logger.error('Database error', { error: err, route: '/api/users' })
 */

export interface LogContext {
  route?: string;
  userId?: string | number;
  [key: string]: unknown;
}

export interface StructuredLog {
  level: 'info' | 'error' | 'warn' | 'debug';
  message: string;
  context?: LogContext;
  timestamp: string;
  stack?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log an info-level message
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  /**
   * Log an error-level message
   */
  error(message: string, context?: LogContext, error?: Error): void {
    const logContext = context || {};
    const stack = this.isDevelopment && error ? error.stack : undefined;
    this.log('error', message, logContext, stack);
  }

  /**
   * Log a warning-level message
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  /**
   * Log a debug-level message (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log('debug', message, context);
    }
  }

  /**
   * Internal log method - outputs structured JSON
   */
  private log(
    level: 'info' | 'error' | 'warn' | 'debug',
    message: string,
    context?: LogContext,
    stack?: string
  ): void {
    const logEntry: StructuredLog = {
      level,
      message,
      timestamp: new Date().toISOString(),
    };

    if (context && Object.keys(context).length > 0) {
      logEntry.context = context;
    }

    if (stack) {
      logEntry.stack = stack;
    }

    // Output as JSON for structured logging (suitable for log aggregation services)
    const output = JSON.stringify(logEntry);

    if (level === 'error') {
      console.error(output);
    } else if (level === 'warn') {
      console.warn(output);
    } else {
      console.log(output);
    }
  }
}

// Export singleton instance
export const logger = new Logger();
