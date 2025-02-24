import { format } from "date-fns";
import {
  Document,
  Paragraph,
  TextRun,
  Packer,
  AlignmentType,
  Header,
  Footer,
  SectionType,
  PageOrientation,
  PageNumber,
  convertInchesToTwip,
} from "docx";
import type { Inspection } from "@shared/schema";

const FONTS = {
  primary: "Arial",
  secondary: "Arial",
};

function calculateCoveredArea(tileSpec?: { dimensions?: string, count?: string }): string | null {
  if (!tileSpec?.dimensions || !tileSpec?.count) return null;

  const [length, width] = tileSpec.dimensions
    .replace(/m/g, '')
    .split('x')
    .map(dim => parseFloat(dim.trim().replace(',', '.')));

  const count = parseInt(tileSpec.count);

  if (isNaN(length) || isNaN(width) || isNaN(count)) return null;

  return (length * width * count).toFixed(2);
}

function getIssueDescription(issue: string): string {
  const descriptions: Record<string, string> = {
    "Armazenagem Incorreta": "Durante a inspeção, foi constatado que as telhas estão sendo armazenadas de forma inadequada, em desacordo com as recomendações técnicas do fabricante...",
    "Carga Permanente sobre as Telhas": "Foi identificada a presença de cargas permanentes não previstas sobre as telhas, incluindo equipamentos, estruturas ou instalações...",
    "Corte de Canto Incorreto ou Ausente": "A inspeção revelou que os cortes de canto das telhas não foram executados corretamente ou estão ausentes...",
    "Estrutura Desalinhada": "Foi constatado que a estrutura de apoio das telhas apresenta desalinhamento significativo...",
    "Fixação Irregular das Telhas": "Durante a vistoria, foi identificado que a fixação das telhas não atende às especificações técnicas do fabricante...",
    "Inclinação da Telha Inferior ao Recomendado": "A inspeção técnica identificou que a inclinação do telhado está abaixo do mínimo recomendado...",
    "Marcas de Caminhamento sobre o Telhado": "Durante a vistoria, foram identificadas marcas evidentes de caminhamento direto sobre as telhas...",
    "Balanço Livre do Beiral Incorreto": "Foi constatado que o balanço livre do beiral está em desacordo com as especificações técnicas...",
    "Número de Apoios e Vão Livre Inadequados": "A análise técnica revelou que a quantidade de apoios e/ou o vão livre entre eles está em desconformidade...",
    "Recobrimento Incorreto": "Foi identificado que o recobrimento entre as telhas não atende às especificações mínimas...",
    "Sentido de Montagem Incorreto": "A vistoria constatou que a montagem das telhas foi executada em sentido contrário...",
    "Uso de Cumeeira Cerâmica": "Foi identificada a utilização de cumeeiras cerâmicas em conjunto com as telhas de fibrocimento...",
    "Uso de Argamassa em Substituição a Peças Complementares": "Durante a inspeção, foi constatado o uso inadequado de argamassa em substituição às peças complementares...",
    "Fixação de Acessórios Complementares Realizada de Forma Inadequada": "A análise técnica identificou que os acessórios complementares não estão fixados de acordo com as especificações..."
  };

  return descriptions[issue] || "";
}

export async function generateInspectionReport(inspection: Inspection): Promise<Blob> {
  const doc = new Document({
    sections: [{
      properties: {
        type: SectionType.CONTINUOUS,
        page: {
          margin: {
            top: convertInchesToTwip(1),
            right: convertInchesToTwip(1),
            bottom: convertInchesToTwip(1),
            left: convertInchesToTwip(1),
          },
          size: {
            orientation: PageOrientation.PORTRAIT,
          },
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              spacing: { before: 0, after: 200 },
              children: [
                new TextRun({
                  text: "SAINT-GOBAIN BRASIL",
                  font: FONTS.primary,
                  size: 32,
                  bold: true,
                }),
              ],
            }),
            new Paragraph({
              spacing: { before: 0, after: 200 },
              children: [
                new TextRun({
                  text: "Divisão Brasilit - Assistência Técnica",
                  font: FONTS.primary,
                  size: 24,
                }),
              ],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: "Página ",
                  font: FONTS.primary,
                  size: 24,
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  font: FONTS.primary,
                  size: 24,
                }),
                new TextRun({
                  text: " de ",
                  font: FONTS.primary,
                  size: 24,
                }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  font: FONTS.primary,
                  size: 24,
                }),
              ],
            }),
          ],
        }),
      },
      children: [
        // Título e informações do cliente
        new Paragraph({
          spacing: { before: 240, after: 240 },
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: "RELATÓRIO DE VISTORIA TÉCNICA",
              font: FONTS.primary,
              size: 32,
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          spacing: { before: 120, after: 120 },
          children: [
            new TextRun({
              text: `Data da Vistoria: ${inspection.dateInspected ? format(new Date(inspection.dateInspected), 'dd/MM/yyyy') : ""}\n`,
              font: FONTS.primary,
              size: 24,
            }),
            new TextRun({
              text: `Cliente: ${inspection.clientName}\n`,
              font: FONTS.primary,
              size: 24,
            }),
            new TextRun({
              text: `Empreendimento: ${inspection.constructionType}\n`,
              font: FONTS.primary,
              size: 24,
            }),
            new TextRun({
              text: `Cidade: ${inspection.city}\n`,
              font: FONTS.primary,
              size: 24,
            }),
            new TextRun({
              text: `Endereço: ${inspection.address}\n`,
              font: FONTS.primary,
              size: 24,
            }),
            new TextRun({
              text: `Protocolo: ${inspection.protocolNumber}\n`,
              font: FONTS.primary,
              size: 24,
            }),
          ],
        }),
        // Análise Técnica
        new Paragraph({
          spacing: { before: 240, after: 120 },
          pageBreakBefore: true,
          children: [
            new TextRun({
              text: "Análise Técnica",
              font: FONTS.primary,
              size: 32,
              bold: true,
            }),
          ],
        }),
        // Problemas identificados
        ...(inspection.issues || []).map((issue, index) => [
          new Paragraph({
            spacing: { before: 120, after: 60 },
            children: [
              new TextRun({
                text: `${index + 1}. ${issue}`,
                font: FONTS.primary,
                size: 24,
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 60, after: 120 },
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: getIssueDescription(issue),
                font: FONTS.primary,
                size: 24,
              }),
            ],
          }),
        ]).flat(),
        // Conclusão
        new Paragraph({
          spacing: { before: 240, after: 120 },
          pageBreakBefore: true,
          children: [
            new TextRun({
              text: "Conclusão",
              font: FONTS.primary,
              size: 32,
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          spacing: { before: 120, after: 120 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: "Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como IMPROCEDENTE...",
              font: FONTS.primary,
              size: 24,
            }),
          ],
        }),
        // Assinatura
        new Paragraph({
          spacing: { before: 360, after: 120 },
          children: [
            new TextRun({
              text: "Atenciosamente,\n\n",
              font: FONTS.primary,
              size: 24,
            }),
            new TextRun({
              text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.\n",
              font: FONTS.primary,
              size: 24,
            }),
            new TextRun({
              text: "Divisão Produtos Para Construção\n",
              font: FONTS.primary,
              size: 24,
            }),
            new TextRun({
              text: "Departamento de Assistência Técnica",
              font: FONTS.primary,
              size: 24,
            }),
          ],
        }),
      ],
    }],
  });

  return await Packer.toBlob(doc);
}