import { format } from "date-fns";
import HTMLtoDOCX from 'html-to-docx';

interface Inspection {
  dateInspected?: string;
  clientName?: string;
  constructionType?: string;
  city?: string;
  address?: string;
  protocolNumber?: string;
  subject?: string;
  technicianName?: string;
  department?: string;
  unit?: string;
  coordinator?: string;
  manager?: string;
  region?: string;
  tileSpecs?: Array<{
    model?: string;
    thickness?: string;
    dimensions?: string;
    count?: string;
  }>;
  issues?: string[];
}

const ISSUE_IMAGES: Record<string, { src: string; caption: string }> = {
  "Armazenagem Incorreta": {
    src: "/images/armazenagem-incorreta.png",
    caption: "Exemplo de armazenagem incorreta de telhas Brasilit"
  },
  "Carga Permanente sobre as Telhas": {
    src: "/images/carga-permanente.png", 
    caption: "Exemplo de carga permanente inadequada sobre telhas Brasilit"
  },
  "Corte de Canto Incorreto ou Ausente": {
    src: "/images/corte-canto-incorreto.png",
    caption: "Exemplo de corte de canto incorreto em telha Brasilit"
  },
  "Fixação Irregular das Telhas": {
    src: "/images/fixacao-irregular.png",
    caption: "Exemplo de fixação irregular em telhas Brasilit"
  },
  "Inclinação da Telha Inferior ao Recomendado": {
    src: "/images/inclinacao-incorreta.png",
    caption: "Exemplo de inclinação inadequada em telhas Brasilit"
  },
  "Marcas de Caminhamento sobre o Telhado": {
    src: "/images/marca-caminhamento.png",
    caption: "Exemplo de marcas de caminhamento inadequado sobre telhas Brasilit"
  },
  "Balanço Livre do Beiral Incorreto": {
    src: "/images/balanco-incorreto.png",
    caption: "Exemplo de balanço livre incorreto do beiral em telhas Brasilit"
  }
};

function getIssueDescription(issue: string): string {
  const descriptions: Record<string, string> = {
    "Armazenagem Incorreta": "Durante a inspeção, foi constatado que as telhas estão sendo armazenadas de forma inadequada...",
    "Carga Permanente sobre as Telhas": "Foi identificada a presença de cargas permanentes não previstas sobre as telhas...",
    "Corte de Canto Incorreto ou Ausente": "A inspeção revelou que os cortes de canto das telhas não foram executados corretamente ou estão ausentes...",
    "Estrutura Desalinhada": "Foi constatado que a estrutura de apoio das telhas apresenta desalinhamento significativo...",
    "Fixação Irregular das Telhas": "Durante a vistoria, foi identificado que a fixação das telhas não atende às especificações técnicas do fabricante...",
    "Inclinação da Telha Inferior ao Recomendado": "A inspeção técnica identificou que a inclinação do telhado está abaixo do mínimo recomendado...",
    "Marcas de Caminhamento sobre o Telhado": "Durante a vistoria, foram identificadas marcas evidentes de caminhamento direto sobre as telhas...",
    "Balanço Livre do Beiral Incorreto": "Foi constatado que o balanço livre do beiral está em desacordo com as especificações técnicas do fabricante...",
    "Número de Apoios e Vão Livre Inadequados": "A análise técnica revelou que a quantidade de apoios e/ou o vão livre entre eles está em desconformidade...",
    "Recobrimento Incorreto": "Foi identificado que o recobrimento entre as telhas não atende às especificações mínimas estabelecidas pelo fabricante...",
    "Sentido de Montagem Incorreto": "A vistoria constatou que a montagem das telhas foi executada em sentido contrário ao tecnicamente recomendado...",
    "Uso de Cumeeira Cerâmica": "Foi identificada a utilização de cumeeiras cerâmicas em conjunto com as telhas de fibrocimento BRASILIT...",
    "Uso de Argamassa em Substituição a Peças Complementares": "Durante a inspeção, foi constatado o uso inadequado de argamassa em substituição às peças complementares originais BRASILIT...",
    "Fixação de Acessórios Complementares Realizada de Forma Inadequada": "A análise técnica identificou que os acessórios complementares (rufos, calhas, pingadeiras, etc.) não estão fixados de acordo com as especificações técnicas do fabricante..."
  };
  return descriptions[issue] || "";
}

function generateHTML(inspection: Inspection): string {
  const issuesHTML = inspection.issues?.map(issue => {
    const image = ISSUE_IMAGES[issue];
    return `
      <h3 style="font-size: 14pt; font-weight: bold; margin-top: 20px;">${issue}</h3>
      <p style="text-align: justify; font-size: 12pt;">${getIssueDescription(issue)}</p>
      ${image ? `
        <div style="text-align: center; margin: 20px 0;">
          <img src="${image.src}" style="width: 400px; height: 300px; object-fit: contain;" />
          <p style="font-style: italic; margin-top: 10px;">${image.caption}</p>
        </div>
      ` : ''}
    `;
  }).join('') || '';

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 16pt;">SAINT-GOBAIN BRASIL</h1>
          <h2 style="font-size: 14pt;">Divisão Brasilit - Assistência Técnica</h2>
        </div>

        <h1 style="text-align: center; font-size: 16pt; margin: 40px 0;">RELATÓRIO DE VISTORIA TÉCNICA</h1>

        <div style="margin: 20px 0;">
          <p><strong>Data da Vistoria:</strong> ${inspection.dateInspected ? format(new Date(inspection.dateInspected), 'dd/MM/yyyy') : ''}</p>
          <p><strong>Cliente:</strong> ${inspection.clientName || ''}</p>
          <p><strong>Empreendimento:</strong> ${inspection.constructionType || ''}</p>
          <p><strong>Cidade:</strong> ${inspection.city || ''}</p>
          <p><strong>Endereço:</strong> ${inspection.address || ''}</p>
          <p><strong>FAR/Protocolo:</strong> ${inspection.protocolNumber || ''}</p>
        </div>

        <div style="margin: 20px 0;">
          <h2 style="font-size: 14pt;">Análise Técnica</h2>
          ${issuesHTML}
        </div>

        <div style="margin-top: 40px;">
          <p>Atenciosamente,</p>
          <p>Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.</p>
          <p>Divisão Produtos Para Construção</p>
          <p>Departamento de Assistência Técnica</p>
        </div>
      </body>
    </html>
  `;
}

export async function generateInspectionReport(inspection: Inspection): Promise<Blob> {
  const html = generateHTML(inspection);
  const docx = await HTMLtoDOCX(html, null, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true,
  });

  return new Blob([docx], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
}