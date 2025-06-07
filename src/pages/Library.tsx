
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import BookManagement from '@/components/library/BookManagement';
import LoanManagement from '@/components/library/LoanManagement';
import MemberBookView from '@/components/library/MemberBookView';
import AdminReservationManagement from '@/components/library/AdminReservationManagement';

const Library: React.FC = () => {
  const { isAdmin } = useAuth();
  const [defaultTab, setDefaultTab] = useState('books');

  useEffect(() => {
    // Set different default tabs based on user role
    setDefaultTab(isAdmin() ? 'books' : 'member-view');
  }, [isAdmin]);

  if (isAdmin()) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca</h1>
          <p className="text-muted-foreground">
            Gerenciamento completo da biblioteca da igreja.
          </p>
        </div>

        <Tabs value={defaultTab} onValueChange={setDefaultTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="books">Livros</TabsTrigger>
            <TabsTrigger value="loans">Empréstimos</TabsTrigger>
            <TabsTrigger value="reservations">Reservas</TabsTrigger>
            <TabsTrigger value="member-view">Visão do Membro</TabsTrigger>
          </TabsList>
          
          <TabsContent value="books">
            <BookManagement />
          </TabsContent>
          
          <TabsContent value="loans">
            <LoanManagement />
          </TabsContent>
          
          <TabsContent value="reservations">
            <AdminReservationManagement />
          </TabsContent>
          
          <TabsContent value="member-view">
            <MemberBookView />
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  // Member view - only show the member book view
  return <MemberBookView />;
};

export default Library;
