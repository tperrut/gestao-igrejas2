
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Info } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface DepartmentCard {
  id: string;
  name: string;
  code: number;
  description: string;
}

const departments: DepartmentCard[] = [
  {
    id: "escola-dominical-homens",
    name: "Escola Dominical - Homens",
    code: 25,
    description: "Ao realizar o PIX, colocar 25 centavos no final para identificar o departamento."
  },
  {
    id: "escola-dominical-mulheres",
    name: "Escola Dominical - Mulheres",
    code: 48,
    description: "Ao realizar o PIX, colocar 48 centavos no final para identificar o departamento."
  },
  {
    id: "escola-dominical-adolescentes",
    name: "Escola Dominical - Adolescentes",
    code: 37,
    description: "Ao realizar o PIX, colocar 37 centavos no final para identificar o departamento."
  },
  {
    id: "escola-dominical-criancas",
    name: "Escola Dominical - Crianças",
    code: 12,
    description: "Ao realizar o PIX, colocar 12 centavos no final para identificar o departamento."
  },
  {
    id: "setor-missionario",
    name: "Setor Missionário",
    code: 70,
    description: "Ao realizar o PIX, colocar 70 centavos no final para identificar o departamento."
  },
  {
    id: "ministerio-louvor",
    name: "Ministério de Louvor",
    code: 55,
    description: "Ao realizar o PIX, colocar 55 centavos no final para identificar o departamento."
  },
];

// Componente QR Code simples para o CNPJ
const QRCodeComponent = ({ cnpj }: { cnpj: string }) => (
  <div className="bg-white p-4 rounded-lg flex justify-center">
    <svg
      className="h-48 w-48"
      viewBox="0 0 200 200"
      style={{ strokeLinecap: "round", stroke: "#000", fill: "none", strokeWidth: "2" }}
    >
      {/* QR Code Pattern simulado para o CNPJ */}
      <rect x="10" y="10" width="30" height="30" fill="#000" />
      <rect x="50" y="10" width="10" height="10" fill="#000" />
      <rect x="70" y="10" width="10" height="10" fill="#000" />
      <rect x="90" y="10" width="30" height="30" fill="#000" />
      <rect x="130" y="10" width="10" height="10" fill="#000" />
      <rect x="150" y="10" width="40" height="40" fill="#000" />
      
      <rect x="10" y="50" width="10" height="10" fill="#000" />
      <rect x="30" y="50" width="10" height="10" fill="#000" />
      <rect x="50" y="50" width="20" height="20" fill="#000" />
      <rect x="80" y="50" width="10" height="10" fill="#000" />
      <rect x="100" y="50" width="20" height="20" fill="#000" />
      <rect x="130" y="50" width="20" height="20" fill="#000" />
      <rect x="160" y="50" width="10" height="10" fill="#000" />
      <rect x="180" y="50" width="10" height="10" fill="#000" />
      
      <rect x="10" y="80" width="20" height="20" fill="#000" />
      <rect x="40" y="80" width="10" height="10" fill="#000" />
      <rect x="60" y="80" width="30" height="30" fill="#000" />
      <rect x="100" y="80" width="10" height="10" fill="#000" />
      <rect x="120" y="80" width="10" height="10" fill="#000" />
      <rect x="140" y="80" width="20" height="20" fill="#000" />
      <rect x="170" y="80" width="20" height="20" fill="#000" />
      
      <rect x="10" y="110" width="10" height="10" fill="#000" />
      <rect x="30" y="110" width="20" height="20" fill="#000" />
      <rect x="60" y="110" width="10" height="10" fill="#000" />
      <rect x="80" y="110" width="10" height="10" fill="#000" />
      <rect x="100" y="110" width="30" height="30" fill="#000" />
      <rect x="140" y="110" width="10" height="10" fill="#000" />
      <rect x="160" y="110" width="30" height="30" fill="#000" />
      
      <rect x="10" y="140" width="30" height="30" fill="#000" />
      <rect x="50" y="140" width="20" height="20" fill="#000" />
      <rect x="80" y="140" width="10" height="10" fill="#000" />
      <rect x="100" y="140" width="10" height="10" fill="#000" />
      <rect x="120" y="140" width="10" height="10" fill="#000" />
      <rect x="140" y="140" width="20" height="20" fill="#000" />
      <rect x="170" y="140" width="10" height="10" fill="#000" />
      
      <rect x="10" y="170" width="10" height="10" fill="#000" />
      <rect x="30" y="170" width="40" height="20" fill="#000" />
      <rect x="80" y="170" width="20" height="20" fill="#000" />
      <rect x="110" y="170" width="10" height="10" fill="#000" />
      <rect x="130" y="170" width="10" height="10" fill="#000" />
      <rect x="150" y="170" width="40" height="20" fill="#000" />
    </svg>
  </div>
);

const Finance = () => {
  const [pixDialogOpen, setPixDialogOpen] = useState(false);
  const cnpj = "13.836.364/0129-11";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ofertar</h1>
          <p className="text-muted-foreground">Faça sua doação para a igreja e seus departamentos.</p>
        </div>
        <Button 
          className="mt-4 md:mt-0" 
          onClick={() => setPixDialogOpen(true)}
        >
          <QrCode className="mr-2 h-4 w-4" />
          Ver QR Code PIX
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card key={dept.id} className="card-hover">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {dept.name}
                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
                  {dept.code} centavos
                </span>
              </CardTitle>
              <CardDescription>Código do departamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-sm">{dept.description}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => setPixDialogOpen(true)}>
                <QrCode className="mr-2 h-4 w-4" />
                Doar para este departamento
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AlertDialog open={pixDialogOpen} onOpenChange={setPixDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>QR Code PIX</AlertDialogTitle>
            <AlertDialogDescription>
              Escaneie o QR Code abaixo para fazer uma doação via PIX. 
              Lembre-se de adicionar os centavos específicos ao valor para identificar o departamento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center py-6">
            <QRCodeComponent cnpj={cnpj} />
          </div>
          <div className="text-center text-sm mb-4">
            <p className="font-medium">CNPJ: {cnpj}</p>
            <p className="font-medium">Chave PIX: igreja@imw.com.br</p>
            <p className="text-muted-foreground">Nome: Igreja Metodista Wesleyana</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction>Fechar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Finance;
