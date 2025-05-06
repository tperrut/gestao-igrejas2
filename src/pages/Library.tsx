
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  available: boolean;
  cover: string;
}

const mockBooks: Book[] = [
  {
    id: 1,
    title: 'A Vida Cristã Prática',
    author: 'João Oliveira',
    category: 'Vida Cristã',
    available: true,
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200',
  },
  {
    id: 2,
    title: 'Comentário Bíblico',
    author: 'Maria Santos',
    category: 'Estudo Bíblico',
    available: false,
    cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=200',
  },
  {
    id: 3,
    title: 'Liderança na Igreja',
    author: 'Pedro Lima',
    category: 'Liderança',
    available: true,
    cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=200',
  },
  {
    id: 4,
    title: 'Adoração e Louvor',
    author: 'Ana Costa',
    category: 'Música',
    available: true,
    cover: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=200',
  },
  {
    id: 5,
    title: 'História da Igreja',
    author: 'Carlos Ferreira',
    category: 'História',
    available: true,
    cover: 'https://images.unsplash.com/photo-1576872381149-7847515ce5d8?q=80&w=200',
  },
  {
    id: 6,
    title: 'Discipulado Eficaz',
    author: 'Marcos Silva',
    category: 'Discipulado',
    available: false,
    cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=200',
  },
];

const BookCard: React.FC<{ book: Book }> = ({ book }) => (
  <Card className="card-hover">
    <CardHeader className="p-0">
      <div className="h-48 overflow-hidden rounded-t-lg">
        <img
          src={book.cover}
          alt={book.title}
          className="h-full w-full object-cover"
        />
      </div>
    </CardHeader>
    <CardContent className="p-4">
      <CardTitle className="text-lg">{book.title}</CardTitle>
      <p className="text-sm text-muted-foreground">{book.author}</p>
      <div className="mt-2 flex items-center">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {book.available ? 'Disponível' : 'Emprestado'}
        </span>
        <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
          {book.category}
        </span>
      </div>
    </CardContent>
    <CardFooter className="p-4 pt-0">
      <Button variant={book.available ? "default" : "outline"} className="w-full" disabled={!book.available}>
        {book.available ? 'Emprestar Livro' : 'Reservar Livro'}
      </Button>
    </CardFooter>
  </Card>
);

const Library: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
        <p className="text-muted-foreground">
          Gerenciar acervo, empréstimos e reservas
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row justify-between">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Pesquisar livros por título, autor ou categoria..."
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="default" className="btn-primary">
            Adicionar Novo Livro
          </Button>
          <Button variant="outline">
            Gerenciar Empréstimos
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos os Livros</TabsTrigger>
          <TabsTrigger value="available">Disponíveis</TabsTrigger>
          <TabsTrigger value="borrowed">Emprestados</TabsTrigger>
          <TabsTrigger value="reserved">Reservados</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="available" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockBooks.filter(book => book.available).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="borrowed" className="mt-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {mockBooks.filter(book => !book.available).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reserved" className="mt-0">
          <p className="text-center text-muted-foreground py-8">
            Não há livros reservados no momento.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;
