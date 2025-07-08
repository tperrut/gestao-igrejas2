import { vi } from 'vitest'

export const createMockSupabaseClient = () => {
  const mockSelect = vi.fn().mockReturnThis()
  const mockInsert = vi.fn().mockReturnThis()
  const mockUpdate = vi.fn().mockReturnThis()
  const mockDelete = vi.fn().mockReturnThis()
  const mockEq = vi.fn().mockReturnThis()
  const mockSingle = vi.fn()
  const mockOrder = vi.fn().mockReturnThis()

  const mockFrom = vi.fn(() => ({
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    single: mockSingle,
    order: mockOrder,
  }))

  const mockAuth = {
    getSession: vi.fn(),
    onAuthStateChange: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
  }

  return {
    from: mockFrom,
    auth: mockAuth,
    // Expose individual methods for easier testing
    mockMethods: {
      select: mockSelect,
      insert: mockInsert,
      update: mockUpdate,
      delete: mockDelete,
      eq: mockEq,
      single: mockSingle,
      order: mockOrder,
      from: mockFrom,
      auth: mockAuth,
    }
  }
}

// Helper function to create common test data
export const createMockBookData = () => ({
  id: '1',
  title: 'Livro Teste',
  author: 'Autor Teste',
  category: 'Categoria Teste',
  isbn: '123456789',
  publisher: 'Editora Teste',
  publication_year: '2023',
  copies: 5,
  available_copies: 3,
  description: 'Descrição do livro teste',
  cover_url: null,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z'
})

export const createMockMemberData = () => ({
  id: '1',
  name: 'Membro Teste',
  email: 'membro@teste.com',
  phone: '(11) 99999-9999',
  birth_date: '1990-01-01',
  join_date: '2023-01-01',
  status: 'active',
  role: 'membro',
  avatar_url: null,
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z'
})

export const createMockLoanData = () => ({
  id: '1',
  book_id: '1',
  member_id: '1',
  borrow_date: '2023-01-01',
  due_date: '2023-01-15',
  return_date: null,
  status: 'active',
  notes: 'Empréstimo teste',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z'
})

export const createMockProfileData = () => ({
  id: '1',
  email: 'admin@teste.com',
  name: 'Admin Teste',
  role: 'admin',
  created_at: '2023-01-01T00:00:00Z',
  updated_at: '2023-01-01T00:00:00Z'
})