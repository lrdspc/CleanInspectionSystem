import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { insertInspectionSchema, type InsertInspection } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { InspectionProblems } from "@/components/inspection-problems";
import { generateInspectionReport } from "@/lib/report-generator";
import { useToast } from "@/hooks/use-toast";

function generateRandomData(): Partial<InsertInspection> {
  const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Porto Alegre"];
  const constructionTypes = ["Residencial", "Comercial", "Industrial", "Galpão", "Escola"];
  const names = ["João Silva", "Maria Santos", "Pedro Oliveira", "Ana Costa", "Carlos Souza"];
  const issues = [
    "Armazenagem Incorreta",
    "Carga Permanente sobre as Telhas",
    "Corte de Canto Incorreto ou Ausente",
    "Estrutura Desalinhada"
  ];

  const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
  const getRandomIssues = () => {
    const numIssues = Math.floor(Math.random() * 3);
    return issues.slice(0, numIssues);
  };

  const protocolNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  return {
    dateInspected: new Date().toISOString().split('T')[0],
    clientName: getRandomElement(names),
    constructionType: getRandomElement(constructionTypes),
    city: getRandomElement(cities),
    address: `Rua ${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 1000)}`,
    protocolNumber: `INS-${protocolNumber}`,
    subject: "Inspeção Técnica",
    technicianName: getRandomElement(names),
    department: "Assistência Técnica",
    unit: `Unidade ${Math.floor(Math.random() * 10) + 1}`,
    coordinator: getRandomElement(names),
    manager: getRandomElement(names),
    region: "Sudeste",
    issues: getRandomIssues(),
    tileSpecs: [{
      model: "FIBROCIMENTO ONDULADA",
      thickness: "5mm",
      dimensions: "2.44x1.10m",
      count: Math.floor(Math.random() * 100).toString()
    }]
  };
}

export default function InspectionForm() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const form = useForm<InsertInspection>({
    resolver: zodResolver(insertInspectionSchema),
    defaultValues: {
      dateInspected: new Date().toISOString().split('T')[0],
      issues: [],
      tileSpecs: [{
        model: "FIBROCIMENTO ONDULADA",
        thickness: "5mm",
        dimensions: "2.44x1.10m",
        count: "0"
      }]
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertInspection) => {
      const res = await apiRequest("POST", "/api/inspections", data);
      const inspection = await res.json();

      // Generate report
      const reportBlob = await generateInspectionReport(inspection);
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${inspection.protocolNumber}.docx`;
      a.click();
      URL.revokeObjectURL(url);

      return inspection;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inspections'] });
      toast({
        title: "Inspeção criada com sucesso",
        description: "O relatório foi gerado e baixado automaticamente."
      });
      navigate("/");
    }
  });

  const handleGenerateTestData = () => {
    const randomData = generateRandomData();
    Object.entries(randomData).forEach(([key, value]) => {
      form.setValue(key as keyof InsertInspection, value as any);
    });
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Nova Inspeção Técnica</span>
            <Button 
              variant="outline" 
              onClick={handleGenerateTestData}
              type="button"
            >
              Gerar Dados de Teste
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="clientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Cliente</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateInspected"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data da Inspeção</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="protocolNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Protocolo</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="constructionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Construção</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technicianName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Técnico</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} defaultValue="Assistência Técnica" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coordinator"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coordenador</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="manager"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gerente</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="region"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Regional</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ''} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <InspectionProblems form={form} />

              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending ? "Gerando relatório..." : "Gerar Relatório"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}