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
  ImageRun,
} from "docx";
import * as fs from 'fs';
import * as path from 'path';

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

const FONTS = {
  primary: "Arial",
  secondary: "Arial",
};

const ISSUE_IMAGES: Record<string, { filename: string; caption: string; }> = {
  "Armazenagem Incorreta": {
    filename: "armazenagem-incorreta.png",
    caption: "Exemplo de armazenagem incorreta de telhas Brasilit"
  },
  "Carga Permanente sobre as Telhas": {
    filename: "carga-permanente.png",
    caption: "Exemplo de carga permanente inadequada sobre telhas Brasilit"
  },
  "Corte de Canto Incorreto ou Ausente": {
    filename: "corte-canto-incorreto.png",
    caption: "Exemplo de corte de canto incorreto em telha Brasilit"
  },
  "Fixação Irregular das Telhas": {
    filename: "fixacao-irregular.png",
    caption: "Exemplo de fixação irregular em telhas Brasilit"
  },
  "Inclinação da Telha Inferior ao Recomendado": {
    filename: "inclinacao-incorreta.png",
    caption: "Exemplo de inclinação inadequada em telhas Brasilit"
  },
  "Marcas de Caminhamento sobre o Telhado": {
    filename: "marca-caminhamento.png",
    caption: "Exemplo de marcas de caminhamento inadequado sobre telhas Brasilit"
  },
  "Balanço Livre do Beiral Incorreto": {
    filename: "balanco-incorreto.png",
    caption: "Exemplo de balanço livre incorreto do beiral em telhas Brasilit"
  }
};

function addImageToReport(issue: string, paragraphs: Paragraph[]): void {
  const issueImage = ISSUE_IMAGES[issue];
  if (!issueImage) {
    console.log(`Nenhuma imagem configurada para o problema: ${issue}`);
    return;
  }

  try {
    const basePath = process.cwd();
    const imagePath = path.join(basePath, 'attached_assets', 'images', issueImage.filename);
    
    if (!fs.existsSync(imagePath)) {
      console.error(`Imagem não encontrada: ${imagePath}`);
      return;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    console.log(`Imagem carregada com sucesso: ${imagePath} (${imageBuffer.length} bytes)`);
      if (fs.existsSync(testPath)) {
        imagePath = testPath;
        break;
      }
    }

    if (!imagePath) {
      console.error(`Imagem não encontrada em nenhum caminho para: ${issueImage.filename}`);
      console.error('Caminhos verificados:', possiblePaths);
      return;
    }

    const imageBuffer = fs.readFileSync(imagePath);
    console.log(`Imagem carregada com sucesso: ${imagePath} (${imageBuffer.length} bytes)`);

    // Adiciona a legenda antes da imagem
    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 60 },
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: issueImage.caption,
            size: 20,
            italics: true
          })
        ]
      })
    );

    // Adiciona a imagem com a configuração correta para DOCX
    paragraphs.push(
      new Paragraph({
        spacing: { before: 60, after: 240 },
        alignment: AlignmentType.CENTER,
        children: [
          new ImageRun({
            data: imageBuffer,
            transformation: {
              width: 400,
              height: 300
            },
            floating: {
              horizontalPosition: {
                relative: "margin",
                align: "center"
              },
              verticalPosition: {
                relative: "paragraph",
                align: "center"
              },
              wrap: {
                type: "square",
                side: "bothSides"
              }
            }
          })
        ]
      })
    );

    console.log(`Imagem adicionada com sucesso ao relatório: ${issue}`);
  } catch (error) {
    console.error(`Erro ao adicionar imagem para ${issue}:`, error);
  }
}

function generateInspectionReport(inspection: Inspection): Promise<Blob> {
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
              text: "Cliente: ",
              font: FONTS.primary,
              size: 24,
              bold: true,
            }),
            new TextRun({
              text: inspection.clientName || "",
              font: FONTS.primary,
              size: 24,
            }),
          ],
        }),
        new Paragraph({
          spacing: { before: 120, after: 120 },
          children: [
            new TextRun({
              text: "Data da Vistoria: ",
              font: FONTS.primary,
              size: 24,
              bold: true,
            }),
            new TextRun({
              text: inspection.dateInspected ? format(new Date(inspection.dateInspected), 'dd/MM/yyyy') : "",
              font: FONTS.primary,
              size: 24,
            }),
          ],
        }),
        ...generateInitialInfo(inspection),
        ...generateTechnicalSection(inspection),
        ...generateConclusion(inspection),
        ...generateSignatures(inspection),
      ],
    }],
  });

  return Packer.toBlob(doc);
}

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
    "Armazenagem Incorreta": "Durante a inspeção, foi constatado que as telhas estão sendo armazenadas de forma inadequada, em desacordo com as recomendações técnicas do fabricante. As telhas BRASILIT devem ser armazenadas em local plano, firme, coberto e seco, protegidas das intempéries. O empilhamento deve ser feito horizontalmente, com as telhas apoiadas sobre caibros ou pontaletes de madeira espaçados no máximo a cada 50cm, garantindo um apoio uniforme. A altura máxima da pilha não deve ultrapassar 200 telhas. É fundamental manter uma distância mínima de 1 metro entre as pilhas para facilitar a circulação. O não cumprimento destas diretrizes pode resultar em deformações, trincas ou quebras das telhas, comprometendo sua integridade e desempenho futuro.",
    "Carga Permanente sobre as Telhas": "Foi identificada a presença de cargas permanentes não previstas sobre as telhas, incluindo equipamentos, estruturas ou instalações. Esta situação é extremamente prejudicial à integridade do sistema de cobertura, pois as telhas BRASILIT são dimensionadas para suportar apenas as cargas previstas em projeto, como seu próprio peso, a ação dos ventos e eventuais cargas acidentais de manutenção. A sobrecarga permanente pode causar deformações, trincas e até mesmo a ruptura das telhas, além de comprometer a estrutura de apoio. É imprescindível a remoção imediata dessas cargas e, caso necessário, deve-se prever uma estrutura independente para suportar equipamentos ou instalações, seguindo as orientações de um profissional habilitado.",
    "Corte de Canto Incorreto ou Ausente": "A inspeção revelou que os cortes de canto das telhas não foram executados corretamente ou estão ausentes. O corte de canto é um procedimento técnico obrigatório que consiste na remoção de um quadrado de 11x11cm nos cantos das telhas onde haverá sobreposição. Este procedimento é fundamental para evitar a sobreposição de quatro espessuras de telha em um mesmo ponto, o que criaria um desnível prejudicial ao escoamento da água e à vedação do telhado. A ausência ou execução incorreta do corte de canto pode resultar em infiltrações, goteiras e deterioração precoce do sistema de cobertura. É necessário realizar os cortes seguindo rigorosamente as especificações técnicas do fabricante.",
    "Estrutura Desalinhada": "Foi constatado que a estrutura de apoio das telhas apresenta desalinhamento significativo em relação aos parâmetros técnicos aceitáveis. Este desalinhamento compromete diretamente o assentamento correto das telhas, afetando o caimento, a sobreposição e a vedação do sistema de cobertura. A estrutura deve estar perfeitamente alinhada e nivelada, com as terças paralelas entre si e perpendiculares à linha de maior caimento do telhado. O desalinhamento pode causar problemas graves como: infiltrações devido à sobreposição irregular das telhas, concentração inadequada de águas pluviais, comprometimento da estética do telhado e possível redução da vida útil do sistema. É necessária a correção do alinhamento da estrutura por profissional habilitado, seguindo as especificações de projeto e as recomendações técnicas do fabricante.",
    "Fixação Irregular das Telhas": "Durante a vistoria, foi identificado que a fixação das telhas não atende às especificações técnicas do fabricante. A fixação adequada das telhas BRASILIT é fundamental para garantir a segurança e o desempenho do sistema de cobertura. As telhas devem ser fixadas com parafusos com rosca soberba Ø 8mm x 110mm ou ganchos com rosca Ø 8mm, sempre acompanhados de conjunto de vedação (arruela metálica e arruela de vedação em PVC). Os pontos de fixação devem seguir rigorosamente o esquema recomendado pelo fabricante, considerando a 2ª e a 4ª crista de onda nas extremidades e terças intermediárias. O reaperto dos parafusos deve ser verificado periodicamente. A fixação inadequada pode resultar em deslocamento das telhas, infiltrações e, em casos extremos, arrancamento das telhas pela ação dos ventos, comprometendo a segurança dos usuários.",
    "Inclinação da Telha Inferior ao Recomendado": "A inspeção técnica identificou que a inclinação do telhado está abaixo do mínimo recomendado nas especificações do fabricante. A inclinação é um fator crítico para o desempenho do sistema de cobertura, pois garante o escoamento adequado das águas pluviais e evita o acúmulo de sujeira. Para telhas BRASILIT, a inclinação mínima varia de acordo com o modelo: para telhas onduladas, deve ser de 15° (27%); para telhas estruturais, 10° (17,6%); e para telhas de fibrocimento planas, 25° (46,6%). A inclinação inadequada pode resultar em infiltrações, acúmulo de águas pluviais, proliferação de fungos e algas, e redução significativa da vida útil do telhado. É necessária a adequação da estrutura para atender à inclinação mínima requerida.",
    "Marcas de Caminhamento sobre o Telhado": "Durante a vistoria, foram identificadas marcas evidentes de caminhamento direto sobre as telhas, caracterizando uso inadequado do sistema de cobertura. As telhas BRASILIT não são projetadas para suportar tráfego direto, mesmo que eventual. O caminhamento incorreto pode causar trincas, deformações e comprometer a integridade das telhas. Para acesso à cobertura durante manutenções ou inspeções, é obrigatório o uso de tábuas ou pranchas apropriadas, apoiadas sobre as terças ou caibros, distribuindo as cargas de maneira adequada. Estas tábuas devem ter largura mínima de 20cm e espessura adequada para suportar o peso sem deformação. É fundamental estabelecer procedimentos seguros de acesso à cobertura e treinar as equipes de manutenção.",
    "Balanço Livre do Beiral Incorreto": "Foi constatado que o balanço livre do beiral está em desacordo com as especificações técnicas do fabricante. O balanço do beiral é a distância entre a última terça e a extremidade da telha, sendo um elemento crucial para o correto funcionamento do sistema de cobertura. Para telhas BRASILIT, o balanço máximo permitido varia de acordo com o modelo e comprimento da telha: para telhas de até 1,83m, o balanço máximo é de 25cm; para telhas de 2,13m até 2,44m, 40cm; e para telhas acima de 3,05m, 50cm. O balanço excessivo pode causar deformações nas telhas, infiltrações e comprometer a estabilidade do beiral. O balanço insuficiente pode resultar em transbordamento de águas pluviais e danos à fachada. É necessário readequar o balanço do beiral seguindo rigorosamente as especificações dofabricante.",
    "Número de Apoios e Vão Livre Inadequados": "A análise técnica revelou que a quantidade de apoios e/ou o vão livre entre eles está em desconformidade com as especificações do fabricante. Esta situação é crítica para a segurança e desempenho do sistema de cobertura. Para telhas BRASILIT, o número mínimo de apoios e o vão máximo permitido são determinados pelo modelo e espessura da telha: para telhas onduladas de 6mm, o vão máximo é de 1,69m com 3 apoios; para telhas de 8mm, 1,99m com 3 apoios; e para telhas estruturais, conforme especificação própria do modelo. O não atendimento a estes parâmetros pode resultar em deformações excessivas, trincas, infiltrações e, em casos extremos, colapso do sistema. É imprescindível a correção do espaçamento entre apoios e/ou adição de apoios intermediários para adequação às normas técnicas.",
    "Recobrimento Incorreto": "Foi identificado que o recobrimento entre as telhas não atende às especificações mínimas estabelecidas pelo fabricante. O recobrimento adequado é fundamental para garantir a estanqueidade do sistema de cobertura. Para telhas BRASILIT, o recobrimento longitudinal deve ser de 14cm para inclinações até 15° e 20cm para inclinações menores que 15°. O recobrimento lateral deve ser de 1¼ onda para telhas onduladas. A não conformidade no recobrimento pode resultar em infiltrações generalizadas, principalmente em períodos de chuva intensa ou com ventos fortes. Além disso, o recobrimento inadequado pode comprometer a fixação das telhas e sua resistência a esforços de sucção causados pelo vento. É necessária a correção dos recobrimentos, o que pode implicar na remontagem parcial ou total do telhado.",
    "Sentido de Montagem Incorreto": "A vistoria constatou que a montagem das telhas foi executada em sentido contrário ao tecnicamente recomendado. O sentido correto de montagem das telhas BRASILIT deve considerar os ventos predominantes da região, iniciando-se a colocação no sentido contrário a estes ventos. Este procedimento é fundamental para evitar que a água da chuva seja forçada contra os recobrimentos pelo vento. A montagem no sentido incorreto pode resultar em infiltrações significativas, principalmente durante chuvas com ventos fortes, comprometendo a estanqueidade do sistema e podendo causar danos ao interior da edificação. A correção desta não conformidade geralmente requer a remontagem completa do telhado.",
    "Uso de Cumeeira Cerâmica": "Foi identificada a utilização de cumeeiras cerâmicas em conjunto com as telhas de fibrocimento BRASILIT, caracterizando uma incompatibilidade técnica grave. As cumeeiras cerâmicas possuem características físicas e dimensionais diferentes das telhas de fibrocimento, resultando em vedação inadequada e alto risco de infiltrações. Além disso, o peso específico diferente dos materiais pode causar deformações e trincas nas telhas. É obrigatório o uso exclusivo de cumeeiras e peças complementares específicas para telhas de fibrocimento BRASILIT, que são projetadas para garantir a perfeita compatibilidade dimensional e vedação do sistema. A substituição das cumeeiras cerâmicas por peçasapropriadas é necessária para garantir o desempenho adequado da cobertura.",
    "Uso de Argamassa em Substituição a Peças Complementares": "Durante a inspeção, foi constatado o uso inadequado de argamassa em substituição às peças complementares originais BRASILIT. Esta prática é tecnicamente incorreta e compromete seriamente o desempenho do sistema de cobertura. A argamassa não possui as características necessárias para acompanhar as movimentações térmicas e estruturais do telhado, resultando em trincas e infiltrações. Além disso, o peso adicional da argamassa pode sobrecarregar a estrutura e as telhas. As peças complementares BRASILIT são especialmente projetadas para garantir avedação adequada e acompanhar as movimentações do sistema, sendo sua utilização obrigatória. É necessária a remoção completa da argamassa e substituição por peças complementares originais apropriadas.",
    "Fixação de Acessórios Complementares Realizada de Forma Inadequada": "A análise técnica identificou que os acessórios complementares (rufos, calhas, pingadeiras, etc.) não estão fixados de acordo com as especificações técnicas do fabricante. A fixação adequada destes elementos é crucial para o desempenho do sistema de cobertura. Os rufos devem ser fixados à estrutura e nunca diretamente nas telhas, com sobreposição mínima de 5cm sobre as telhas e vedação apropriada. As calhas devem ter dimensionamento adequado, inclinação mínima de 0,5% e estar corretamente fixadas à estrutura. O espaçamento entre os suportes deve seguir as especificações do fabricante. A fixação inadequada pode resultar em infiltrações, transbordamentos, oxidação da estrutura e danos ao sistema de cobertura. É necessária a revisão completa da fixação dos acessórios complementares, seguindo rigorosamente as recomendações técnicas."
  };

  return descriptions[issue] || "";
}


function generateInitialInfo(inspection: Inspection): Paragraph[] {
  return [
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
          text: `Data de vistoria: ${inspection.dateInspected ? format(new Date(inspection.dateInspected), 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy')}\n`,
          font: FONTS.primary,
          size: 24,
        }),
        new TextRun({
          text: `Cliente: ${inspection.clientName || "Cliente Teste"}`,
          font: FONTS.primary,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: `Empreendimento: ${inspection.constructionType || "Residencial"}\n`,
          font: FONTS.primary,
          size: 24,
        }),
        new TextRun({
          text: `Cidade: ${inspection.city || "Sarandi - PR"}\n`,
          font: FONTS.primary,
          size: 24,
        }),
        new TextRun({
          text: `Endereço: ${inspection.address || "Rua de Teste, 123"}\n`,
          font: FONTS.primary,
          size: 24,
        }),
        new TextRun({
          text: `FAR/Protocolo: ${inspection.protocolNumber || "TST-1739885771916"}\n`,
          font: FONTS.primary,
          size: 24,
        }),
        new TextRun({
          text: `Assunto: ${inspection.subject || "AT - BRA - PERMEABILIDADE - Telhado com vazamento Geral"}`,
          font: FONTS.primary,
          size: 24,
        }),

      ],
    }),

    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: `Elaborado por: ${inspection.technicianName || "Técnico Teste"}\n`,
          font: FONTS.primary,
          size: 24,
        }),
        new TextRun({
          text: `Departamento: ${inspection.department || "Assistência Técnica"}\n`,
          font: FONTS.primary,
          size: 24,
        }),
        new TextRun({
          text: `Unidade: ${inspection.unit || "PR"}\n`,
          font: FONTS.primary,
          size: 24,
        }),
        new TextRun({
          text: `Coordenador Responsável: ${inspection.coordinator || "Marlon Weingartner"}\n`,
          font: FONTS.primary,
          size: 24,
        }),
        new TextRun({
          text: `Gerente Responsável: ${inspection.manager || "Elisabete Kudo"}\n`,
          font: FONTS.primary,
          size: 24,
        }),
        new TextRun({
          text: `Regional: ${inspection.region || "Sul"}`,
          font: FONTS.primary,
          size: 24,
        }),
      ],
    }),

    new Paragraph({
      spacing: { before: 240, after: 120 },
      children: [
        new TextRun({
          text: "Introdução",
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
          text: "A Área de Assistência Técnica foi solicitada para atender uma reclamação relacionada ao surgimento de infiltrações nas telhas de fibrocimento: - Telha da marca BRASILIT modelo ONDULADA de 5mm, produzidas com tecnologia CRFS - Cimento Reforçado com Fios Sintéticos - 100% sem amianto - cuja fabricação segue a norma internacional ISO 9933, bem como as normas técnicas da ABNT: NBR-15210-1, NBR-15210-2 e NBR-15210-3.",
          font: FONTS.primary,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 120, after: 120 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: `Em atenção a vossa solicitação, analisamos as evidências encontradas, para avaliar as manifestações patológicas reclamadas em telhas de nossa marca aplicada em sua cobertura conforme registro de reclamação protocolo FAR ${inspection.protocolNumber || '[NÚMERO DO PROTOCOLO]'}.`,
          font: FONTS.primary,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 120, after: 120 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: `O modelo de telha escolhido para a edificação foi: ${inspection.tileSpecs?.[0]?.model || '[MODELO]'} de ${inspection.tileSpecs?.[0]?.thickness?.replace('mm', '') || '[ESPESSURA]'}mm.  Quantidade: ${inspection.tileSpecs?.[0]?.count || '[QUANTIDADE]'}  Área coberta: ${calculateCoveredArea(inspection.tileSpecs?.[0]) || '[ÁREA]'}m² aproximadamente. A análise do caso segue os requisitos presentes na norma ABNT NBR 7196: Telhas de fibrocimento sem amianto — Execução de coberturas e fechamentos laterais —Procedimento e Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit.`,
          font: FONTS.primary,
          size: 24,
        }),
      ],
    }),
  ];
}

function generateTechnicalSection(inspection: Inspection): Paragraph[] {
  const paragraphs: Paragraph[] = [
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
    new Paragraph({
      spacing: { before: 120, after: 240 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: "Durante a visita técnica realizada no local, nossa equipe conduziu uma vistoria minuciosa da cobertura, documentando e analisando as condições de instalação e o estado atual das telhas. Após criteriosa avaliação das evidências coletadas em campo, identificamos alguns desvios nos procedimentos de manuseio e instalação em relação às especificações técnicas do fabricante, os quais são detalhados a seguir:",
          font: FONTS.primary,
          size: 24,
        }),
      ],
    }),
  ];

  if (inspection.issues?.length) {
    inspection.issues.forEach((issue) => {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 240, after: 60 },
          children: [
            new TextRun({
              text: `${issue}`,
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
        })
      );

      addImageToReport(issue, paragraphs);
    });
  }

  return paragraphs;
}

function generateConclusion(inspection: Inspection): Paragraph[] {
  const paragraphs = [
    new Paragraph({
      spacing: { before: 360, after: 240 },
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
  ];

  if (inspection.issues && inspection.issues.length > 0) {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: "Com base na análise técnica realizada, foram identificadas as seguintes não conformidades:",
            font: FONTS.primary,
            size: 24,
          }),
        ],
      })
    );

    inspection.issues.forEach((issue, index) => {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [
            new TextRun({
              text: `${index + 1}. ${issue}`,
              font: FONTS.primary,
              size: 24,
            }),
          ],
        })
      );
    });

    paragraphs.push(
      new Paragraph({
        spacing: { before: 240, after: 120 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: "Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como IMPROCEDENTE, onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material.",
            font: FONTS.primary,
            size: 24,
          }),
        ],
      })
    );

    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: "As telhas BRASILIT modelo FIBROCIMENTO ONDULADA possuem dez anos de garantia com relação a problemas de fabricação. A garantia Brasilit está condicionada a correta aplicação do produto, seguindo rigorosamente as instruções de instalação contidas no Guia Técnico de Telhas de Fibrocimento e Acessórios para Telhado — Brasilit. Este guia técnico está sempre disponível em: http://www.brasilit.com.br.",
            font: FONTS.primary,
            size: 24,
          }),
        ],
      })
    );

    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: "Ratificamos que os produtos Brasilit atendem as Normas da Associação Brasileira de Normas Técnicas —ABNT, específicas para cada linha de produto, e cumprimos as exigências legais de garantia de produtos conforme a legislação em vigor.",
            font: FONTS.primary,
            size: 24,
          }),
        ],
      })
    );

    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: "Desde já, agradecemos e nos colocamos à disposição para quaisquer esclarecimentos que se fizerem necessário.",
            font: FONTS.primary,
            size: 24,
          }),
        ],
      })
    );
  } else {
    paragraphs.push(
      new Paragraph({
        spacing: { before: 120, after: 120 },
        alignment: AlignmentType.JUSTIFIED,
        children: [
          new TextRun({
            text: "A análise técnica não identificou não conformidades significativas. As telhas e sua instalação atendem às especificações técnicas e recomendações do fabricante.",
            font: FONTS.primary,
            size: 24,
          }),
        ],
      })
    );
  }

  return paragraphs;
}

function generateSignatures(inspection: Inspection): Paragraph[] {
  return [
    new Paragraph({
      spacing: { before: 600, after: 240 },
      children: [
        new TextRun({
          text: "Atenciosamente,",
          font: FONTS.primary,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.",
          font: FONTS.primary,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 120, after: 120 },
      children: [
        new TextRun({
          text: "Divisão Produtos Para Construção",
          font: FONTS.primary,
          size: 24,
        }),
      ],
    }),
    new Paragraph({
      spacing: { before: 120, after:120 },
      children: [
        new TextRun({
          text: "Departamento de Assistência Técnica",
          font: FONTS.primary,
          size: 24,
        }),
      ],
    }),
  ];
}