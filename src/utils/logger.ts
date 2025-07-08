// Sistema de logging centralizado para rastreamento de ações importantes
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export enum LogCategory {
  AUTH = 'auth',
  API = 'api',
  BUSINESS_LOGIC = 'business_logic',
  VALIDATION = 'validation',
  SECURITY = 'security',
  DATABASE = 'database'
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  action: string;
  details?: any;
  userId?: string;
  sessionId?: string;
  error?: Error;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Limite de logs em memória

  private formatLog(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}] [${entry.category}]`;
    const details = entry.details ? ` | Details: ${JSON.stringify(entry.details)}` : '';
    const error = entry.error ? ` | Error: ${entry.error.message}` : '';
    return `${prefix} ${entry.action}${details}${error}`;
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Manter apenas os últimos logs para evitar uso excessivo de memória
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Log no console para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      const formattedLog = this.formatLog(entry);
      switch (entry.level) {
        case LogLevel.ERROR:
          console.error(formattedLog);
          break;
        case LogLevel.WARN:
          console.warn(formattedLog);
          break;
        case LogLevel.INFO:
          console.info(formattedLog);
          break;
        case LogLevel.DEBUG:
          console.debug(formattedLog);
          break;
      }
    }
  }

  debug(category: LogCategory, action: string, details?: any, userId?: string): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      category,
      action,
      details,
      userId
    });
  }

  info(category: LogCategory, action: string, details?: any, userId?: string): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      category,
      action,
      details,
      userId
    });
  }

  warn(category: LogCategory, action: string, details?: any, userId?: string): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      category,
      action,
      details,
      userId
    });
  }

  error(category: LogCategory, action: string, error?: Error, details?: any, userId?: string): void {
    this.addLog({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      category,
      action,
      details,
      userId,
      error
    });
  }

  // Métodos específicos para diferentes categorias
  authLog(action: string, userId?: string, details?: any): void {
    this.info(LogCategory.AUTH, action, details, userId);
  }

  authError(action: string, error: Error, details?: any, userId?: string): void {
    this.error(LogCategory.AUTH, action, error, details, userId);
  }

  apiLog(action: string, details?: any, userId?: string): void {
    this.info(LogCategory.API, action, details, userId);
  }

  apiError(action: string, error: Error, details?: any, userId?: string): void {
    this.error(LogCategory.API, action, error, details, userId);
  }

  businessLog(action: string, details?: any, userId?: string): void {
    this.info(LogCategory.BUSINESS_LOGIC, action, details, userId);
  }

  businessError(action: string, error: Error, details?: any, userId?: string): void {
    this.error(LogCategory.BUSINESS_LOGIC, action, error, details, userId);
  }

  validationLog(action: string, details?: any): void {
    this.info(LogCategory.VALIDATION, action, details);
  }

  validationError(action: string, error: Error, details?: any): void {
    this.error(LogCategory.VALIDATION, action, error, details, undefined);
  }

  securityLog(action: string, details?: any, userId?: string): void {
    this.warn(LogCategory.SECURITY, action, details, userId);
  }

  securityError(action: string, error: Error, details?: any, userId?: string): void {
    this.error(LogCategory.SECURITY, action, error, details, userId);
  }

  dbLog(action: string, details?: any, userId?: string): void {
    this.info(LogCategory.DATABASE, action, details, userId);
  }

  dbError(action: string, error: Error, details?: any, userId?: string): void {
    this.error(LogCategory.DATABASE, action, error, details, userId);
  }

  // Métodos utilitários
  getLogs(level?: LogLevel, category?: LogCategory): LogEntry[] {
    return this.logs.filter(log => {
      if (level && log.level !== level) return false;
      if (category && log.category !== category) return false;
      return true;
    });
  }

  exportLogs(): string {
    return this.logs.map(log => this.formatLog(log)).join('\n');
  }

  clearLogs(): void {
    this.logs = [];
  }
}

// Instância singleton do logger
export const logger = new Logger();

// Hook para usar o logger em componentes React
export const useLogger = () => {
  return logger;
};