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

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Nova Inspeção Técnica</CardTitle>
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
                        <Input {...field} />
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
                        <Input type="date" {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} defaultValue="Assistência Técnica" />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
                        <Input {...field} />
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
