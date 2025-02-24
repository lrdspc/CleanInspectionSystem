import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Plus } from "lucide-react";
import type { Inspection } from "@shared/schema";
import { format } from "date-fns";

export default function Home() {
  const { data: inspections, isLoading } = useQuery<Inspection[]>({ 
    queryKey: ['/api/inspections']
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Inspeções Técnicas Brasilit</h1>
        <Link href="/new-inspection">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nova Inspeção
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div>Carregando...</div>
      ) : inspections?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <ClipboardList className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">Nenhuma inspeção registrada</p>
            <Link href="/new-inspection">
              <Button className="mt-4">Criar primeira inspeção</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {inspections?.map((inspection) => (
            <Card key={inspection.id}>
              <CardHeader>
                <CardTitle>{inspection.clientName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Data: {format(new Date(inspection.dateInspected), 'dd/MM/yyyy')}
                </p>
                <p className="text-sm text-muted-foreground">
                  Protocolo: {inspection.protocolNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  Técnico: {inspection.technicianName}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
