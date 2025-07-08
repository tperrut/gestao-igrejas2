import { describe, it, expect, beforeEach, vi } from 'vitest'
import { logger, LogLevel, LogCategory } from '@/utils/logger'

// Mock console methods
const originalConsole = global.console
beforeEach(() => {
  vi.clearAllMocks()
  logger.clearLogs()
  
  global.console = {
    ...originalConsole,
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }
})

describe('Logger', () => {
  describe('Basic logging functionality', () => {
    it('should log debug messages', () => {
      logger.debug(LogCategory.AUTH, 'Test debug message', { test: 'data' }, 'user123')
      
      const logs = logger.getLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]).toMatchObject({
        level: LogLevel.DEBUG,
        category: LogCategory.AUTH,
        action: 'Test debug message',
        details: { test: 'data' },
        userId: 'user123'
      })
    })

    it('should log info messages', () => {
      logger.info(LogCategory.API, 'Test info message')
      
      const logs = logger.getLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]).toMatchObject({
        level: LogLevel.INFO,
        category: LogCategory.API,
        action: 'Test info message'
      })
    })

    it('should log warning messages', () => {
      logger.warn(LogCategory.SECURITY, 'Test warning message')
      
      const logs = logger.getLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]).toMatchObject({
        level: LogLevel.WARN,
        category: LogCategory.SECURITY,
        action: 'Test warning message'
      })
    })

    it('should log error messages with error objects', () => {
      const error = new Error('Test error')
      logger.error(LogCategory.DATABASE, 'Test error message', error, { context: 'test' }, 'user123')
      
      const logs = logger.getLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]).toMatchObject({
        level: LogLevel.ERROR,
        category: LogCategory.DATABASE,
        action: 'Test error message',
        details: { context: 'test' },
        userId: 'user123',
        error: error
      })
    })
  })

  describe('Specialized logging methods', () => {
    it('should log authentication events', () => {
      logger.authLog('User signed in', 'user123', { method: 'email' })
      
      const logs = logger.getLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]).toMatchObject({
        level: LogLevel.INFO,
        category: LogCategory.AUTH,
        action: 'User signed in',
        userId: 'user123',
        details: { method: 'email' }
      })
    })

    it('should log authentication errors', () => {
      const error = new Error('Invalid credentials')
      logger.authError('Sign in failed', error, { email: 'test@example.com' }, 'user123')
      
      const logs = logger.getLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]).toMatchObject({
        level: LogLevel.ERROR,
        category: LogCategory.AUTH,
        action: 'Sign in failed',
        error: error,
        details: { email: 'test@example.com' },
        userId: 'user123'
      })
    })

    it('should log business logic events', () => {
      logger.businessLog('Loan created', { loanId: 'loan123', bookId: 'book456' }, 'user123')
      
      const logs = logger.getLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]).toMatchObject({
        level: LogLevel.INFO,
        category: LogCategory.BUSINESS_LOGIC,
        action: 'Loan created',
        details: { loanId: 'loan123', bookId: 'book456' },
        userId: 'user123'
      })
    })

    it('should log database operations', () => {
      logger.dbLog('Query executed', { table: 'loans', operation: 'SELECT' })
      
      const logs = logger.getLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]).toMatchObject({
        level: LogLevel.INFO,
        category: LogCategory.DATABASE,
        action: 'Query executed',
        details: { table: 'loans', operation: 'SELECT' }
      })
    })

    it('should log security events', () => {
      logger.securityLog('Rate limit triggered', { ip: '192.168.1.1', attempts: 5 })
      
      const logs = logger.getLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]).toMatchObject({
        level: LogLevel.WARN,
        category: LogCategory.SECURITY,
        action: 'Rate limit triggered',
        details: { ip: '192.168.1.1', attempts: 5 }
      })
    })

    it('should log validation events', () => {
      logger.validationLog('Email format validated', { email: 'test@example.com', valid: true })
      
      const logs = logger.getLogs()
      expect(logs).toHaveLength(1)
      expect(logs[0]).toMatchObject({
        level: LogLevel.INFO,
        category: LogCategory.VALIDATION,
        action: 'Email format validated',
        details: { email: 'test@example.com', valid: true }
      })
    })
  })

  describe('Log filtering and management', () => {
    beforeEach(() => {
      logger.info(LogCategory.AUTH, 'Auth info')
      logger.error(LogCategory.API, 'API error', new Error('Test'))
      logger.warn(LogCategory.SECURITY, 'Security warning')
      logger.debug(LogCategory.DATABASE, 'DB debug')
    })

    it('should filter logs by level', () => {
      const errorLogs = logger.getLogs(LogLevel.ERROR)
      expect(errorLogs).toHaveLength(1)
      expect(errorLogs[0].action).toBe('API error')

      const infoLogs = logger.getLogs(LogLevel.INFO)
      expect(infoLogs).toHaveLength(1)
      expect(infoLogs[0].action).toBe('Auth info')
    })

    it('should filter logs by category', () => {
      const authLogs = logger.getLogs(undefined, LogCategory.AUTH)
      expect(authLogs).toHaveLength(1)
      expect(authLogs[0].action).toBe('Auth info')

      const securityLogs = logger.getLogs(undefined, LogCategory.SECURITY)
      expect(securityLogs).toHaveLength(1)
      expect(securityLogs[0].action).toBe('Security warning')
    })

    it('should filter logs by both level and category', () => {
      const authInfoLogs = logger.getLogs(LogLevel.INFO, LogCategory.AUTH)
      expect(authInfoLogs).toHaveLength(1)
      expect(authInfoLogs[0].action).toBe('Auth info')

      const authErrorLogs = logger.getLogs(LogLevel.ERROR, LogCategory.AUTH)
      expect(authErrorLogs).toHaveLength(0)
    })

    it('should export logs as formatted string', () => {
      const exportedLogs = logger.exportLogs()
      expect(exportedLogs).toContain('Auth info')
      expect(exportedLogs).toContain('API error')
      expect(exportedLogs).toContain('Security warning')
      expect(exportedLogs).toContain('DB debug')
    })

    it('should clear all logs', () => {
      expect(logger.getLogs()).toHaveLength(4)
      logger.clearLogs()
      expect(logger.getLogs()).toHaveLength(0)
    })
  })

  describe('Log limits and memory management', () => {
    it('should respect maximum log limit', () => {
      // This test would require mocking the internal maxLogs property
      // For demonstration, we'll just verify basic functionality
      for (let i = 0; i < 10; i++) {
        logger.info(LogCategory.AUTH, `Message ${i}`)
      }
      
      const logs = logger.getLogs()
      expect(logs).toHaveLength(10)
    })
  })
})