import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useLoanService } from '@/services/loanService'
import { createMockSupabaseClient, createMockLoanData, createMockBookData, createMockMemberData } from '../mocks/supabaseMock'

// Mock do Supabase
const mockSupabase = createMockSupabaseClient()
vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase,
}))

// Mock do toast
const mockToast = vi.fn()
vi.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

// Mock do logger
vi.mock('@/utils/logger', () => ({
  logger: {
    dbLog: vi.fn(),
    dbError: vi.fn(),
    businessLog: vi.fn(),
    businessError: vi.fn(),
  },
}))

describe('useLoanService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchLoans', () => {
    it('should fetch loans successfully', async () => {
      // Arrange
      const mockLoanData = {
        ...createMockLoanData(),
        books: createMockBookData(),
        members: createMockMemberData(),
      }

      mockSupabase.mockMethods.single.mockResolvedValue({
        data: [mockLoanData],
        error: null,
      })

      // Act
      const { result } = renderHook(() => useLoanService())
      const loans = await result.current.fetchLoans()

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('loans')
      expect(mockSupabase.mockMethods.select).toHaveBeenCalled()
      expect(mockSupabase.mockMethods.order).toHaveBeenCalledWith('due_date')
      expect(loans).toHaveLength(1)
      expect(loans[0]).toMatchObject({
        id: mockLoanData.id,
        book: {
          id: mockLoanData.books.id,
          title: mockLoanData.books.title,
        },
        member: {
          id: mockLoanData.members.id,
          name: mockLoanData.members.name,
        },
      })
    })

    it('should handle fetch loans error', async () => {
      // Arrange
      const error = new Error('Database error')
      mockSupabase.mockMethods.single.mockResolvedValue({
        data: null,
        error,
      })

      // Act
      const { result } = renderHook(() => useLoanService())
      const loans = await result.current.fetchLoans()

      // Assert
      expect(loans).toEqual([])
      expect(mockToast).toHaveBeenCalledWith({
        title: "Erro ao carregar empréstimos",
        description: "Ocorreu um erro ao buscar os empréstimos.",
        variant: "destructive"
      })
    })
  })

  describe('saveLoan', () => {
    it('should save loan successfully', async () => {
      // Arrange
      const loanData = {
        book_id: '1',
        member_id: '1',
        borrow_date: '2023-01-01',
        due_date: '2023-01-15',
        notes: 'Test loan',
      }

      mockSupabase.mockMethods.insert.mockResolvedValue({
        data: null,
        error: null,
      })

      // Act
      const { result } = renderHook(() => useLoanService())
      const success = await result.current.saveLoan(loanData)

      // Assert
      expect(success).toBe(true)
      expect(mockSupabase.from).toHaveBeenCalledWith('loans')
      expect(mockSupabase.mockMethods.insert).toHaveBeenCalledWith([{
        book_id: loanData.book_id,
        member_id: loanData.member_id,
        borrow_date: loanData.borrow_date,
        due_date: loanData.due_date,
        notes: loanData.notes,
        status: 'active'
      }])
      expect(mockToast).toHaveBeenCalledWith({
        title: "Empréstimo registrado",
        description: "O empréstimo foi registrado com sucesso."
      })
    })

    it('should handle save loan error', async () => {
      // Arrange
      const loanData = {
        book_id: '1',
        member_id: '1',
        borrow_date: '2023-01-01',
        due_date: '2023-01-15',
        notes: 'Test loan',
      }

      const error = new Error('Insert failed')
      mockSupabase.mockMethods.insert.mockResolvedValue({
        data: null,
        error,
      })

      // Act
      const { result } = renderHook(() => useLoanService())
      const success = await result.current.saveLoan(loanData)

      // Assert
      expect(success).toBe(false)
      expect(mockToast).toHaveBeenCalledWith({
        title: "Erro",
        description: "Ocorreu um erro ao registrar o empréstimo.",
        variant: "destructive"
      })
    })
  })

  describe('returnLoan', () => {
    it('should return loan successfully', async () => {
      // Arrange
      const loanId = '1'
      mockSupabase.mockMethods.update.mockResolvedValue({
        data: null,
        error: null,
      })

      // Act
      const { result } = renderHook(() => useLoanService())
      const success = await result.current.returnLoan(loanId)

      // Assert
      expect(success).toBe(true)
      expect(mockSupabase.from).toHaveBeenCalledWith('loans')
      expect(mockSupabase.mockMethods.update).toHaveBeenCalledWith({
        status: 'returned',
        return_date: expect.any(String)
      })
      expect(mockSupabase.mockMethods.eq).toHaveBeenCalledWith('id', loanId)
      expect(mockToast).toHaveBeenCalledWith({
        title: "Livro devolvido",
        description: "O livro foi devolvido com sucesso."
      })
    })

    it('should handle return loan error', async () => {
      // Arrange
      const loanId = '1'
      const error = new Error('Update failed')
      mockSupabase.mockMethods.update.mockResolvedValue({
        data: null,
        error,
      })

      // Act
      const { result } = renderHook(() => useLoanService())
      const success = await result.current.returnLoan(loanId)

      // Assert
      expect(success).toBe(false)
      expect(mockToast).toHaveBeenCalledWith({
        title: "Erro",
        description: "Ocorreu um erro ao registrar a devolução.",
        variant: "destructive"
      })
    })
  })

  describe('cancelLoan', () => {
    it('should cancel loan successfully', async () => {
      // Arrange
      const loanId = '1'
      mockSupabase.mockMethods.delete.mockResolvedValue({
        data: null,
        error: null,
      })

      // Act
      const { result } = renderHook(() => useLoanService())
      const success = await result.current.cancelLoan(loanId)

      // Assert
      expect(success).toBe(true)
      expect(mockSupabase.from).toHaveBeenCalledWith('loans')
      expect(mockSupabase.mockMethods.delete).toHaveBeenCalled()
      expect(mockSupabase.mockMethods.eq).toHaveBeenCalledWith('id', loanId)
      expect(mockToast).toHaveBeenCalledWith({
        title: "Empréstimo cancelado",
        description: "O empréstimo foi cancelado com sucesso."
      })
    })

    it('should handle cancel loan error', async () => {
      // Arrange
      const loanId = '1'
      const error = new Error('Delete failed')
      mockSupabase.mockMethods.delete.mockResolvedValue({
        data: null,
        error,
      })

      // Act
      const { result } = renderHook(() => useLoanService())
      const success = await result.current.cancelLoan(loanId)

      // Assert
      expect(success).toBe(false)
      expect(mockToast).toHaveBeenCalledWith({
        title: "Erro",
        description: "Ocorreu um erro ao cancelar o empréstimo.",
        variant: "destructive"
      })
    })
  })
})