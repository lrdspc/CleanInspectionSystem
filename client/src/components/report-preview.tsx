
import React from 'react';
import { format } from 'date-fns';

interface ReportPreviewProps {
  formData: any;
}

export function ReportPreview({ formData }: ReportPreviewProps) {
  return (
    <div className="bg-white p-8 font-serif">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">SAINT-GOBAIN BRASIL</h1>
        <h2 className="text-xl">Divisão Brasilit - Assistência Técnica</h2>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4">RELATÓRIO DE VISTORIA TÉCNICA</h3>
        <p>Data da vistoria: {formData.dateInspected ? format(new Date(formData.dateInspected), 'dd/MM/yyyy') : ''}</p>
        <p>Cliente: {formData.clientName}</p>
        <p>Empreendimento: {formData.constructionType}</p>
        <p>Cidade: {formData.city}</p>
        <p>Endereço: {formData.address}</p>
        <p>Protocolo: {formData.protocolNumber}</p>
      </div>

      <div className="mb-8">
        <h4 className="text-lg font-bold mb-2">Problemas Identificados:</h4>
        <ul className="list-disc pl-4">
          {formData.selectedIssues?.map((issue: string) => (
            <li key={issue}>{issue}</li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <p>Elaborado por: {formData.technicianName}</p>
        <p>Departamento: {formData.department}</p>
        <p>Unidade: {formData.unit}</p>
      </div>
    </div>
  );
}
