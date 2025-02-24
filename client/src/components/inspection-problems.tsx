import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormReturn } from "react-hook-form";
import type { InsertInspection } from "@shared/schema";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export const CONSTRUCTION_TYPES = [
  "Residencial",
  "Comercial", 
  "Industrial",
  "Outro"
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

export function InspectionProblems({ form }: { form: UseFormReturn<InsertInspection> }) {
  const handleImageUpload = (issue: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        // Atualiza o form com a nova imagem
        const currentImages = form.getValues("issueImages") || [];
        const updatedImages = [
          ...currentImages.filter(img => img.issueType !== issue),
          {
            issueType: issue,
            imageUrl: base64String,
            caption: `Foto do problema: ${issue}`
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
        <div className="grid grid-cols-1 gap-6">
          {INSPECTION_ISSUES.map((issue) => (
            <div key={issue} className="border rounded-lg p-4 space-y-4">
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

                          // Remove a imagem se o problema for desmarcado
                          if (!checked) {
                            const currentImages = form.getValues("issueImages") || [];
                            form.setValue(
                              "issueImages",
                              currentImages.filter(img => img.issueType !== issue)
                            );
                          }
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-base">{issue}</FormLabel>
                  </FormItem>
                )}
              />

              {/* Área de upload e preview apenas se o problema estiver selecionado */}
              {form.watch("issues")?.includes(issue) && (
                <div className="ml-8 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adicionar foto do problema
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(issue, e)}
                      className="cursor-pointer"
                    />
                  </div>

                  {/* Preview da imagem com melhor visibilidade */}
                  {form.watch("issueImages")?.find(img => img.issueType === issue) && (
                    <div className="bg-white p-4 rounded-lg border">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview da imagem:</p>
                      <img
                        src={form.watch("issueImages")?.find(img => img.issueType === issue)?.imageUrl}
                        alt={`Preview: ${issue}`}
                        className="max-w-full h-auto rounded-lg shadow-sm"
                        style={{ maxHeight: '300px', objectFit: 'contain' }}
                      />
                      <p className="text-sm text-gray-500 mt-2 italic">
                        Imagem carregada para: {issue}
                      </p>
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