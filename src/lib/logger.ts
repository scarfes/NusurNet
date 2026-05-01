/**
 * Lightweight structured logger.
 *
 * Sprint 0: console-based with structured output.
 * Later sprints: replace with pino or send to a centralized logger.
 *
 * Usage:
 *   import { logger } from '@/lib/logger';
 *   logger.info('user.created', { userId });
 *   logger.error('payment.failed', { orderId, error });
 */
import { env } from '@/lib/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: unknown;
}

function log(level: LogLevel, event: string, context?: LogContext): void {
  // Skip debug in production
  if (level === 'debug' && env.NODE_ENV === 'production') return;

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...context,
  };

  // Use the appropriate console method to preserve native log levels.
  const fn =
    level === 'error'
      ? console.error
      : level === 'warn'
        ? console.warn
        : console.info;

  fn(JSON.stringify(entry));
}

export const logger = {
  debug: (event: string, context?: LogContext) => log('debug', event, context),
  info: (event: string, context?: LogContext) => log('info', event, context),
  warn: (event: string, context?: LogContext) => log('warn', event, context),
  error: (event: string, context?: LogContext) => log('error', event, context),
};
