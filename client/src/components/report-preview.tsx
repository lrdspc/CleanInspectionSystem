
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

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-4">RELATÓRIO DE VISTORIA TÉCNICA</h3>
        <p>Data da vistoria: {formData.dateInspected ? format(new Date(formData.dateInspected), 'dd/MM/yyyy') : ''}</p>
        <p>Protocolo: {formData.protocolNumber || ''}</p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold">Dados do Cliente</h4>
        <p>Cliente: {formData.clientName || ''}</p>
        <p>Tipo de Construção: {formData.constructionType || ''}</p>
        <p>Cidade: {formData.city || ''}</p>
        <p>Endereço: {formData.address || ''}</p>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold">Especificações Técnicas</h4>
        {formData.tileSpecs?.map((spec, index) => (
          <div key={index} className="ml-4 mt-2">
            <p>Modelo: {spec.model}</p>
            <p>Espessura: {spec.thickness}</p>
            <p>Dimensões: {spec.dimensions}</p>
            <p>Quantidade: {spec.count}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h4 className="font-semibold">Problemas Identificados</h4>
        <ul className="list-disc ml-4 mt-2">
          {formData.issues?.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <p>Elaborado por: {formData.technicianName || ''}</p>
        <p>Departamento: {formData.department || ''}</p>
        <p>Unidade: {formData.unit || ''}</p>
      </div>
    </div>
  );
}
