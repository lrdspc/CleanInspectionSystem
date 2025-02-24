
import React from 'react';
import { format } from 'date-fns';
import { type InsertInspection } from '@/shared/schema';

interface ReportPreviewProps {
  formData: Partial<InsertInspection>;
}

export function ReportPreview({ formData }: ReportPreviewProps) {
  return (
    <div className="prose prose-sm max-w-none p-6 bg-white">
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold mb-2">SAINT-GOBAIN BRASIL</h1>
        <h2 className="text-lg">Divisão Brasilit - Assistência Técnica</h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold">RELATÓRIO DE VISTORIA TÉCNICA</h3>
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
        <h4 className="font-semibold">Dados do Responsável</h4>
        <p>Técnico: {formData.technicianName || ''}</p>
        <p>Departamento: {formData.department || ''}</p>
        <p>Unidade: {formData.unit || ''}</p>
      </div>
    </div>
  );
}
