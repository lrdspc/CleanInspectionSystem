
import React from 'react';
import { format } from 'date-fns';
import { InsertInspection } from '@/shared/schema';

interface ReportPreviewProps {
  formData: Partial<InsertInspection>;
}

export function ReportPreview({ formData }: ReportPreviewProps) {
  return (
    <div className="space-y-4 text-sm">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold mb-2">SAINT-GOBAIN BRASIL</h1>
        <h2 className="text-lg">Divisão Brasilit - Assistência Técnica</h2>
      </div>

      <div>
        <h3 className="text-lg font-semibold">Dados Básicos</h3>
        <p>Cliente: {formData.clientName}</p>
        <p>Data da Vistoria: {formData.dateInspected ? format(new Date(formData.dateInspected), 'dd/MM/yyyy') : ''}</p>
        <p>Tipo de Construção: {formData.constructionType}</p>
        <p>Cidade: {formData.city}</p>
        <p>Endereço: {formData.address}</p>
      </div>

      {formData.tileSpecs && formData.tileSpecs.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Especificações Técnicas</h3>
          {formData.tileSpecs.map((spec, index) => (
            <div key={index} className="ml-4">
              <p>Modelo: {spec.model}</p>
              <p>Espessura: {spec.thickness}</p>
              <p>Dimensões: {spec.dimensions}</p>
              <p>Quantidade: {spec.count}</p>
            </div>
          ))}
        </div>
      )}

      {formData.issues && formData.issues.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold">Problemas Identificados</h3>
          <ul className="list-disc ml-4">
            {formData.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
