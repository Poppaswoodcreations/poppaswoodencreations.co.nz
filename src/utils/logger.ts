/**
 * Logging utilities
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private log(level: LogLevel, message: string, ...args: any[]) {
    if (!this.isDevelopment && level === 'debug') return;

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, ...args);
        break;
      case 'info':
        console.info(prefix, message, ...args);
        break;
      case 'warn':
        console.warn(prefix, message, ...args);
        break;
      case 'error':
        console.error(prefix, message, ...args);
        break;
    }
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args);
  }

  // Log product operations
  product(action: string, productName: string, details?: any) {
    this.info(`Product ${action}: ${productName}`, details);
  }

  // Log cart operations
  cart(action: string, details?: any) {
    this.info(`Cart ${action}`, details);
  }

  // Log admin operations
  admin(action: string, details?: any) {
    this.info(`Admin ${action}`, details);
  }

  // Log performance metrics
  performance(metric: string, value: number, unit: string = 'ms') {
    this.debug(`Performance: ${metric} = ${value}${unit}`);
  }
}

export const logger = new Logger();
export default logger;