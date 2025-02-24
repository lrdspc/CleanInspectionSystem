import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Plus, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import type { Inspection } from "@shared/schema";
import { format } from "date-fns";

export default function Home() {
  const { data: inspections, isLoading } = useQuery<Inspection[]>({ 
    queryKey: ['/api/inspections']
  });

  const totalInspections = inspections?.length || 0;
  const completedInspections = inspections?.filter(i => i.issues?.length === 0).length || 0;
  const pendingInspections = totalInspections - completedInspections;

  return (
    <div className="space-y-8">
      {/* Dashboard Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Inspeções</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInspections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inspeções Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedInspections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inspeções Pendentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingInspections}</div>
          </CardContent>
        </Card>
      </div>

      {/* Inspeções Recentes */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Inspeções Recentes</h2>
          <Link href="/new-inspection">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Inspeção
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
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
              <Card key={inspection.id} className="hover:bg-accent/5 transition-colors">
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <span className="truncate">{inspection.clientName}</span>
                    {inspection.issues?.length === 0 ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground flex items-center gap-2">
                      <span className="font-medium">Data:</span>
                      {format(new Date(inspection.dateInspected), 'dd/MM/yyyy')}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <span className="font-medium">Protocolo:</span>
                      {inspection.protocolNumber}
                    </p>
                    <p className="text-muted-foreground flex items-center gap-2">
                      <span className="font-medium">Técnico:</span>
                      {inspection.technicianName}
                    </p>
                    {inspection.issues && inspection.issues.length > 0 && (
                      <p className="text-muted-foreground flex items-center gap-2">
                        <span className="font-medium">Problemas:</span>
                        {inspection.issues.length}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}