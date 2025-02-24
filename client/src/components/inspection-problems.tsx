import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import type { InsertInspection } from "@shared/schema";
import { ImageUpload } from "./ImageUpload";
import { useState } from "react";

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
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const handleImageUpload = async (file: File) => {
    if (!selectedIssue) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        // Update the form with the new image
        const currentImages = form.getValues("issueImages") || [];
        const updatedImages = [
          ...currentImages.filter(img => img.issueType !== selectedIssue),
          {
            issueType: selectedIssue,
            imageUrl: base64String,
            caption: `Foto do problema: ${selectedIssue}`
          }
        ];

        form.setValue("issueImages", updatedImages);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Problemas Identificados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INSPECTION_ISSUES.map((issue) => (
            <div key={issue} className="space-y-4">
              <FormField
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
                          if (checked) {
                            setSelectedIssue(issue);
                          } else {
                            setSelectedIssue(null);
                            // Remove a imagem se o problema for desmarcado
                            const currentImages = form.getValues("issueImages") || [];
                            form.setValue(
                              "issueImages",
                              currentImages.filter(img => img.issueType !== issue)
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">{issue}</FormLabel>
                  </FormItem>
                )}
              />
              {form.watch("issues")?.includes(issue) && (
                <div className="ml-8">
                  <ImageUpload
                    onImageUpload={handleImageUpload}
                    label={`Adicionar foto para ${issue}`}
                  />
                  {/* Preview da imagem */}
                  {form.watch("issueImages")?.find(img => img.issueType === issue) && (
                    <div className="mt-2">
                      <img
                        src={form.watch("issueImages")?.find(img => img.issueType === issue)?.imageUrl}
                        alt={`Preview: ${issue}`}
                        className="max-w-full h-auto rounded-lg"
                        style={{ maxHeight: '200px' }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}