import { describe, it, expect } from 'vitest'
import { 
  validateEmail, 
  validatePhone, 
  validatePassword, 
  sanitizeText, 
  validateFileName, 
  validateFileSize, 
  validateImageType 
} from '@/utils/validation'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should validate correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('test+tag@example.org')).toBe(true)
    })

    it('should reject invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('@domain.com')).toBe(false)
      expect(validateEmail('test..test@domain.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should validate correct phone formats', () => {
      expect(validatePhone('(11) 99999-9999')).toBe(true)
      expect(validatePhone('+5511999999999')).toBe(true)
      expect(validatePhone('11 9 9999-9999')).toBe(true)
      expect(validatePhone('')).toBe(true) // Empty is valid (optional)
    })

    it('should reject invalid phone formats', () => {
      expect(validatePhone('abc')).toBe(false)
      expect(validatePhone('123')).toBe(false)
      expect(validatePhone('++5511999999999')).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123')
      expect(result.valid).toBe(true)
      expect(result.message).toBeUndefined()
    })

    it('should reject passwords that are too short', () => {
      const result = validatePassword('Short1')
      expect(result.valid).toBe(false)
      expect(result.message).toBe('A senha deve ter pelo menos 8 caracteres')
    })

    it('should reject passwords without lowercase letters', () => {
      const result = validatePassword('PASSWORD123')
      expect(result.valid).toBe(false)
      expect(result.message).toBe('A senha deve conter pelo menos uma letra minúscula')
    })

    it('should reject passwords without uppercase letters', () => {
      const result = validatePassword('password123')
      expect(result.valid).toBe(false)
      expect(result.message).toBe('A senha deve conter pelo menos uma letra maiúscula')
    })

    it('should reject passwords without numbers', () => {
      const result = validatePassword('PasswordOnly')
      expect(result.valid).toBe(false)
      expect(result.message).toBe('A senha deve conter pelo menos um número')
    })
  })

  describe('sanitizeText', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeText('<script>alert("xss")</script>Hello')).toBe('alert("xss")Hello')
      expect(sanitizeText('<div>Content</div>')).toBe('Content')
    })

    it('should escape dangerous characters', () => {
      expect(sanitizeText('Hello & <script>')).toBe('Hello &amp; &lt;script&gt;')
      expect(sanitizeText('Test "quotes" and \'apostrophes\'')).toBe('Test &quot;quotes&quot; and &#x27;apostrophes&#x27;')
    })

    it('should handle empty and null inputs', () => {
      expect(sanitizeText('')).toBe('')
      expect(sanitizeText(null as any)).toBe('')
      expect(sanitizeText(undefined as any)).toBe('')
    })
  })

  describe('validateFileName', () => {
    it('should validate safe file names', () => {
      expect(validateFileName('document.pdf')).toBe(true)
      expect(validateFileName('image_123.jpg')).toBe(true)
      expect(validateFileName('file-name.txt')).toBe(true)
    })

    it('should reject unsafe file names', () => {
      expect(validateFileName('../malicious.exe')).toBe(false)
      expect(validateFileName('.hidden-file')).toBe(false)
      expect(validateFileName('file with spaces.pdf')).toBe(false)
      expect(validateFileName('file@symbol.txt')).toBe(false)
    })
  })

  describe('validateFileSize', () => {
    it('should validate files within size limit', () => {
      const smallFile = new File(['content'], 'test.txt', { type: 'text/plain' })
      expect(validateFileSize(smallFile, 5)).toBe(true)
    })

    it('should reject files exceeding size limit', () => {
      // Create a mock file that's larger than 5MB
      const largeFile = {
        size: 6 * 1024 * 1024, // 6MB
      } as File
      expect(validateFileSize(largeFile, 5)).toBe(false)
    })
  })

  describe('validateImageType', () => {
    it('should validate allowed image types', () => {
      const jpegFile = new File([''], 'image.jpg', { type: 'image/jpeg' })
      const pngFile = new File([''], 'image.png', { type: 'image/png' })
      const webpFile = new File([''], 'image.webp', { type: 'image/webp' })
      
      expect(validateImageType(jpegFile)).toBe(true)
      expect(validateImageType(pngFile)).toBe(true)
      expect(validateImageType(webpFile)).toBe(true)
    })

    it('should reject non-image file types', () => {
      const textFile = new File([''], 'document.txt', { type: 'text/plain' })
      const pdfFile = new File([''], 'document.pdf', { type: 'application/pdf' })
      
      expect(validateImageType(textFile)).toBe(false)
      expect(validateImageType(pdfFile)).toBe(false)
    })
  })
})