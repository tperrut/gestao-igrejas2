
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface MemberLookupProps {
  onMemberSelected: (member: Member) => void;
  selectedMember?: Member | null;
}

const MemberLookup: React.FC<MemberLookupProps> = ({ onMemberSelected, selectedMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filtered = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers([]);
    }
  }, [searchTerm, members]);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, name, email, phone')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleMemberSelect = (member: Member) => {
    onMemberSelected(member);
    setSearchTerm(member.name);
    setFilteredMembers([]);
  };

  const clearSelection = () => {
    onMemberSelected({ id: '', name: '', email: '', phone: '' });
    setSearchTerm('');
    setFilteredMembers([]);
  };

  if (selectedMember && selectedMember.id) {
    return (
      <div className="space-y-4 p-4 border rounded-lg bg-green-50">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-green-600" />
          <h3 className="font-medium text-green-800">Membro Selecionado</h3>
        </div>
        <div className="space-y-2">
          <p><strong>Nome:</strong> {selectedMember.name}</p>
          <p><strong>Email:</strong> {selectedMember.email}</p>
          {selectedMember.phone && <p><strong>Telefone:</strong> {selectedMember.phone}</p>}
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={clearSelection}
          className="w-full"
        >
          Alterar Membro
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="member-search">
          Buscar Membro <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="member-search"
            placeholder="Digite o nome ou email do membro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredMembers.length > 0 && (
        <div className="border rounded-lg max-h-48 overflow-y-auto">
          {filteredMembers.map((member) => (
            <button
              key={member.id}
              onClick={() => handleMemberSelect(member)}
              className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 focus:bg-blue-50 focus:outline-none"
            >
              <div className="font-medium">{member.name}</div>
              <div className="text-sm text-muted-foreground">{member.email}</div>
            </button>
          ))}
        </div>
      )}

      {searchTerm.length >= 2 && filteredMembers.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          Nenhum membro encontrado com "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default MemberLookup;
