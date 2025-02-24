
import React from 'react';
import { InsertInspection } from '@/shared/schema';

interface ReportPreviewProps {
  formData: Partial<InsertInspection>;
}

export function ReportPreview({ formData }: ReportPreviewProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Dados Básicos</h3>
      <div>
        <p><strong>Cliente:</strong> {formData.clientName}</p>
        <p><strong>Data da Vistoria:</strong> {formData.dateInspected}</p>
        <p><strong>Tipo de Construção:</strong> {formData.constructionType}</p>
        <p><strong>Cidade:</strong> {formData.city}</p>
        <p><strong>Endereço:</strong> {formData.address}</p>
      </div>

      <h3 className="text-lg font-semibold mt-4">Especificações Técnicas</h3>
      <div>
        {formData.tileSpecs?.map((spec, index) => (
          <div key={index} className="mb-2">
            <p><strong>Modelo:</strong> {spec.model}</p>
            <p><strong>Espessura:</strong> {spec.thickness}</p>
            <p><strong>Dimensões:</strong> {spec.dimensions}</p>
            <p><strong>Quantidade:</strong> {spec.count}</p>
          </div>
        ))}
      </div>

      <h3 className="text-lg font-semibold mt-4">Problemas Identificados</h3>
      <div>
        {formData.issues?.map((issue, index) => (
          <p key={index}>• {issue}</p>
        ))}
      </div>
    </div>
  );
}
