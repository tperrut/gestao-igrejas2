
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useBookService } from '@/services/bookService'
import { createMockSupabaseClient, createMockBookData } from '../mocks/supabaseMock'

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

describe('useBookService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchBooks', () => {
    it('should fetch books successfully', async () => {
      // Arrange
      const mockBookData = createMockBookData()
      mockSupabase.mockMethods.order.mockResolvedValue({
        data: [mockBookData],
        error: null,
      })

      // Act
      const { result } = renderHook(() => useBookService())
      const books = await result.current.fetchBooks()

      // Assert
      expect(mockSupabase.from).toHaveBeenCalledWith('books')
      expect(mockSupabase.mockMethods.select).toHaveBeenCalledWith('*')
      expect(mockSupabase.mockMethods.order).toHaveBeenCalledWith('title')
      expect(books).toEqual([mockBookData])
    })

    it('should handle fetch books error', async () => {
      // Arrange
      const error = new Error('Database error')
      mockSupabase.mockMethods.order.mockResolvedValue({
        data: null,
        error,
      })

      // Act
      const { result } = renderHook(() => useBookService())
      const books = await result.current.fetchBooks()

      // Assert
      expect(books).toEqual([])
      expect(mockToast).toHaveBeenCalledWith({
        title: "Erro ao carregar livros",
        description: "Ocorreu um erro ao buscar os livros.",
        variant: "destructive"
      })
    })
  })

  describe('saveBook', () => {
    it('should create new book successfully', async () => {
      // Arrange
      const bookData = {
        title: 'Novo Livro',
        author: 'Autor Teste',
        category: 'Categoria Teste',
        isbn: '123456789',
        publisher: 'Editora',
        publication_year: '2023',
        copies: 5,
        available_copies: 5,
        description: 'Descrição do livro',
        cover_url: null,
      }

      mockSupabase.mockMethods.insert.mockResolvedValue({
        data: null,
        error: null,
      })

      // Act
      const { result } = renderHook(() => useBookService())
      const success = await result.current.saveBook(bookData)

      // Assert
      expect(success).toBe(true)
      expect(mockSupabase.from).toHaveBeenCalledWith('books')
      expect(mockSupabase.mockMethods.insert).toHaveBeenCalledWith([{
        title: bookData.title,
        author: bookData.author,
        category: bookData.category,
        isbn: bookData.isbn,
        publisher: bookData.publisher,
        publication_year: bookData.publication_year,
        copies: bookData.copies,
        available_copies: bookData.available_copies,
        description: bookData.description,
        cover_url: bookData.cover_url,
      }])
      expect(mockToast).toHaveBeenCalledWith({
        title: "Livro adicionado",
        description: `${bookData.title} foi adicionado com sucesso.`
      })
    })

    it('should update existing book successfully', async () => {
      // Arrange
      const bookData = {
        title: 'Livro Editado',
        author: 'Autor Teste',
        category: 'Categoria Teste',
        isbn: '123456789',
        publisher: 'Editora',
        publication_year: '2023',
        copies: 5,
        available_copies: 5,
        description: 'Descrição do livro',
        cover_url: null,
      }
      const bookId = '1'

      mockSupabase.mockMethods.update.mockResolvedValue({
        data: null,
        error: null,
      })

      // Act
      const { result } = renderHook(() => useBookService())
      const success = await result.current.saveBook(bookData, bookId)

      // Assert
      expect(success).toBe(true)
      expect(mockSupabase.from).toHaveBeenCalledWith('books')
      expect(mockSupabase.mockMethods.update).toHaveBeenCalledWith({
        title: bookData.title,
        author: bookData.author,
        category: bookData.category,
        isbn: bookData.isbn,
        publisher: bookData.publisher,
        publication_year: bookData.publication_year,
        copies: bookData.copies,
        description: bookData.description,
        cover_url: bookData.cover_url,
      })
      expect(mockSupabase.mockMethods.eq).toHaveBeenCalledWith('id', bookId)
      expect(mockToast).toHaveBeenCalledWith({
        title: "Livro atualizado",
        description: `${bookData.title} foi atualizado com sucesso.`
      })
    })

    it('should handle save book error', async () => {
      // Arrange
      const bookData = {
        title: 'Livro Teste',
        author: 'Autor Teste',
        category: 'Categoria Teste',
        isbn: '123456789',
        publisher: 'Editora',
        publication_year: '2023',
        copies: 5,
        available_copies: 5,
        description: 'Descrição do livro',
        cover_url: null,
      }

      const error = new Error('Insert failed')
      mockSupabase.mockMethods.insert.mockResolvedValue({
        data: null,
        error,
      })

      // Act
      const { result } = renderHook(() => useBookService())
      const success = await result.current.saveBook(bookData)

      // Assert
      expect(success).toBe(false)
      expect(mockToast).toHaveBeenCalledWith({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o livro.",
        variant: "destructive"
      })
    })
  })
})
