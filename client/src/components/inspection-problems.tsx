import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import type { InsertInspection } from "@shared/schema";

export const INSPECTION_ISSUES = [
  "Armazenagem Incorreta",
  "Carga Permanente sobre as Telhas",
  "Corte de Canto Incorreto ou Ausente",
  "Estrutura Desalinhada",
  "Fixação Irregular das Telhas",
  "Inclinação da Telha Inferior ao Recomendado",
  "Marcas de Caminhamento sobre o Telhado",
  "Balanço Livre do Beiral Incorreto",
  "Número de Apoios e Vão Livre Inadequados",
  "Recobrimento Incorreto",
  "Sentido de Montagem Incorreto",
  "Uso de Cumeeira Cerâmica",
  "Uso de Argamassa em Substituição a Peças Complementares",
  "Fixação de Acessórios Complementares Realizada de Forma Inadequada"
];

export const TILE_MODELS = [
  "Fibrotex",
  "Ondina",
  "Ondina Plus",
  "Ondulada",
  "Translúcida",
  "Topcomfort",
  "Maxionda",
  "Onda 50",
  "Kalheta",
  "Kalheta 49",
  "Kalhetão 90",
  "Outro"
];

export const CONSTRUCTION_TYPES = [
  "Residencial",
  "Comercial",
  "Industrial",
  "Outro"
];

export function InspectionProblems({ form }: { form: UseFormReturn<InsertInspection> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Problemas Identificados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INSPECTION_ISSUES.map((issue) => (
            <FormField
              key={issue}
              control={form.control}
              name="issues"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(issue)}
                      onCheckedChange={(checked) => {
                        const current = field.value || [];
                        const updated = checked
                          ? [...current, issue]
                          : current.filter((i) => i !== issue);
                        field.onChange(updated);
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">{issue}</FormLabel>
                </FormItem>
              )}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}