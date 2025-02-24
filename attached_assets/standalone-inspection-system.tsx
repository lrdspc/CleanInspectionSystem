import React, { useState, useRef } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';

// Constants moved to top for better organization
const CONSTRUCTION_TYPES = ["Residencial", "Comercial", "Industrial", "Outro"];
const TILE_MODELS = ["Fibrotex", "Ondina", "Ondina Plus", "Ondulada", "Translúcida", "Topcomfort", "Maxionda", "Onda 50", "Kalheta", "Kalheta 49", "Kalhetão 90", "Outro"];
const ROOF_ISSUES = [
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

// Type for form data
type FormData = {
  clientName: string;
  dateInspected: string;
  constructionType: string;
  address: string;
  city: string;
  technicianName: string;
  protocolNumber: string;
  department: string;
  unit: string;
  region: string;
  coordinatorName: string;
  managerName: string;
  inspectionSubject: string;
  tileSpecs: Array<{
    model: string;
    thickness: string;
    dimensions: string;
    count: string;
  }>;
  selectedIssues: string[];
};

const ISSUE_DESCRIPTIONS = {
  "Armazenagem Incorreta": `Durante a inspeção, foi constatado que as telhas estão sendo armazenadas de forma inadequada, em desacordo com as recomendações técnicas do fabricante. As telhas BRASILIT devem ser armazenadas em local plano, firme, coberto e seco, protegidas das intempéries. O empilhamento deve ser feito horizontalmente, com as telhas apoiadas sobre caibros ou pontaletes de madeira espaçados no máximo a cada 50cm, garantindo um apoio uniforme. A altura máxima da pilha não deve ultrapassar 200 telhas. É fundamental manter uma distância mínima de 1 metro entre as pilhas para facilitar a circulação. O não cumprimento destas diretrizes pode resultar em deformações, trincas ou quebras das telhas, comprometendo sua integridade e desempenho futuro.`,
  "Carga Permanente sobre as Telhas": `Foi identificada a presença de cargas permanentes não previstas sobre as telhas, incluindo equipamentos, estruturas ou instalações. Esta situação é extremamente prejudicial à integridade do sistema de cobertura, pois as telhas BRASILIT são dimensionadas para suportar apenas as cargas previstas em projeto, como seu próprio peso, a ação dos ventos e eventuais cargas acidentais de manutenção. A sobrecarga permanente pode causar deformações, trincas e até mesmo a ruptura das telhas, além de comprometer a estrutura de apoio. É imprescindível a remoção imediata dessas cargas e, caso necessário, deve-se prever uma estrutura independente para suportar equipamentos ou instalações, seguindo as orientações de um profissional habilitado.`,
  "Corte de Canto Incorreto ou Ausente":
    "A inspeção revelou que os cortes de canto das telhas não foram executados corretamente ou estão ausentes. O corte de canto é um procedimento técnico obrigatório que consiste na remoção de um quadrado de 11x11cm nos cantos das telhas onde haverá sobreposição. Este procedimento é fundamental para evitar a sobreposição de quatro espessuras de telha em um mesmo ponto, o que criaria um desnível prejudicial ao escoamento da água e à vedação do telhado. A ausência ou execução incorreta do corte de canto pode resultar em infiltrações, goteiras e deterioração precoce do sistema de cobertura. É necessário realizar os cortes seguindo rigorosamente as especificações técnicas do fabricante.",
  "Estrutura Desalinhada":
    "Foi constatado que a estrutura de apoio das telhas apresenta desalinhamento significativo em relação aos parâmetros técnicos aceitáveis. Este desalinhamento compromete diretamente o assentamento correto das telhas, afetando o caimento, a sobreposição e a vedação do sistema de cobertura. A estrutura deve estar perfeitamente alinhada e nivelada, com as terças paralelas entre si e perpendiculares à linha de maior caimento do telhado. O desalinhamento pode causar problemas graves como: infiltrações devido à sobreposição irregular das telhas, concentração inadequada de águas pluviais, comprometimento da estética do telhado e possível redução da vida útil do sistema. É necessária a correção do alinhamento da estrutura por profissional habilitado, seguindo as especificações de projeto e as recomendações técnicas do fabricante.",
  "Fixação Irregular das Telhas":
    "Durante a vistoria, foi identificado que a fixação das telhas não atende às especificações técnicas do fabricante. A fixação adequada das telhas BRASILIT é fundamental para garantir a segurança e o desempenho do sistema de cobertura. As telhas devem ser fixadas com parafusos com rosca soberba Ø 8mm x 110mm ou ganchos com rosca Ø 8mm, sempre acompanhados de conjunto de vedação (arruela metálica e arruela de vedação em PVC). Os pontos de fixação devem seguir rigorosamente o esquema recomendado pelo fabricante, considerando a 2ª e a 4ª crista de onda nas extremidades e terças intermediárias. O reaperto dos parafusos deve ser verificado periodicamente. A fixação inadequada pode resultar em deslocamento das telhas, infiltrações e, em casos extremos, arrancamento das telhas pela ação dos ventos, comprometendo a segurança dos usuários.",
  "Inclinação da Telha Inferior ao Recomendado":
    "A inspeção técnica identificou que a inclinação do telhado está abaixo do mínimo recomendado nas especificações do fabricante. A inclinação é um fator crítico para o desempenho do sistema de cobertura, pois garante o escoamento adequado das águas pluviais e evita o acúmulo de sujeira. Para telhas BRASILIT, a inclinação mínima varia de acordo com o modelo: para telhas onduladas, deve ser de 15° (27%); para telhas estruturais, 10° (17,6%); e para telhas de fibrocimento planas, 25° (46,6%). A inclinação inadequada pode resultar em infiltrações, acúmulo de águas pluviais, proliferação de fungos e algas, e redução significativa da vida útil do telhado. É necessária a adequação da estrutura para atender à inclinação mínima requerida.",
  "Marcas de Caminhamento sobre o Telhado":
    "Durante a vistoria, foram identificadas marcas evidentes de caminhamento direto sobre as telhas, caracterizando uso inadequado do sistema de cobertura. As telhas BRASILIT não são projetadas para suportar tráfego direto, mesmo que eventual. O caminhamento incorreto pode causar trincas, deformações e comprometer a integridade das telhas. Para acesso à cobertura durante manutenções ou inspeções, é obrigatório o uso de tábuas ou pranchas apropriadas, apoiadas sobre as terças ou caibros, distribuindo as cargas de maneira adequada. Estas tábuas devem ter largura mínima de 20cm e espessura adequada para suportar o peso sem deformação. É fundamental estabelecer procedimentos seguros de acesso à cobertura e treinar as equipes de manutenção.",
  "Balanço Livre do Beiral Incorreto":
    "Foi constatado que o balanço livre do beiral está em desacordo com as especificações técnicas do fabricante. O balanço do beiral é a distância entre a última terça e a extremidade da telha, sendo um elemento crucial para o correto funcionamento do sistema de cobertura. Para telhas BRASILIT, o balanço máximo permitido varia de acordo com o modelo e comprimento da telha: para telhas de até 1,83m, o balanço máximo é de 25cm; para telhas de 2,13m até 2,44m, 40cm; e para telhas acima de 3,05m, 50cm. O balanço excessivo pode causar deformações nas telhas, infiltrações e comprometer a estabilidade do beiral. O balanço insuficiente pode resultar em transbordamento de águas pluviais e danos à fachada. É necessário readequar o balanço do beiral seguindo rigorosamente as especificações do fabricante.",
  "Número de Apoios e Vão Livre Inadequados":
    "A análise técnica revelou que a quantidade de apoios e/ou o vão livre entre eles está em desconformidade com as especificações do fabricante. Esta situação é crítica para a segurança e desempenho do sistema de cobertura. Para telhas BRASILIT, o número mínimo de apoios e o vão máximo permitido são determinados pelo modelo e espessura da telha: para telhas onduladas de 6mm, o vão máximo é de 1,69m com 3 apoios; para telhas de 8mm, 1,99m com 3 apoios; e para telhas estruturais, conforme especificação própria do modelo. O não atendimento a estes parâmetros pode resultar em deformações excessivas, trincas, infiltrações e, em casos extremos, colapso do sistema. É imprescindível a correção do espaçamento entre apoios e/ou adição de apoios intermediários para adequação às normas técnicas.",
  "Recobrimento Incorreto":
    "Foi identificado que o recobrimento entre as telhas não atende às especificações mínimas estabelecidas pelo fabricante. O recobrimento adequado é fundamental para garantir a estanqueidade do sistema de cobertura. Para telhas BRASILIT, o recobrimento longitudinal deve ser de 14cm para inclinações até 15° e 20cm para inclinações menores que 15°. O recobrimento lateral deve ser de 1¼ onda para telhas onduladas. A não conformidade no recobrimento pode resultar em infiltrações generalizadas, principalmente em períodos de chuva intensa ou com ventos fortes. Além disso, o recobrimento inadequado pode comprometer a fixação das telhas e sua resistência a esforços de sucção causados pelo vento. É necessária a correção dos recobrimentos, o que pode implicar na remontagem parcial ou total do telhado.",
  "Sentido de Montagem Incorreto":
    "A vistoria constatou que a montagem das telhas foi executada em sentido contrário ao tecnicamente recomendado. O sentido correto de montagem das telhas BRASILIT deve considerar os ventos predominantes da região, iniciando-se a colocação no sentido contrário a estes ventos. Este procedimento é fundamental para evitar que a água da chuva seja forçada contra os recobrimentos pelo vento. A montagem no sentido incorreto pode resultar em infiltrações significativas, principalmente durante chuvas com ventos fortes, comprometendo a estanqueidade do sistema e podendo causar danos ao interior da edificação. A correção desta não conformidade geralmente requer a remontagem completa do telhado.",
  "Uso de Cumeeira Cerâmica":
    "Foi identificada a utilização de cumeeiras cerâmicas em conjunto com as telhas de fibrocimento BRASILIT, caracterizando uma incompatibilidade técnica grave. As cumeeiras cerâmicas possuem características físicas e dimensionais diferentes das telhas de fibrocimento, resultando em vedação inadequada e alto risco de infiltrações. Além disso, o peso específico diferente dos materiais pode causar deformações e trincas nas telhas. É obrigatório o uso exclusivo de cumeeiras e peças complementares específicas para telhas de fibrocimento BRASILIT, que são projetadas para garantir a perfeita compatibilidade dimensional e vedação do sistema. A substituição das cumeeiras cerâmicas por peças apropriadas é necessária para garantir o desempenho adequado da cobertura.",
  "Uso de Argamassa em Substituição a Peças Complementares":
    "Durante a inspeção, foi constatado o uso inadequado de argamassa em substituição às peças complementares originais BRASILIT. Esta prática é tecnicamente incorreta e compromete seriamente o desempenho do sistema de cobertura. A argamassa não possui as características necessárias para acompanhar as movimentações térmicas e estruturais do telhado, resultando em trincas e infiltrações. Além disso, o peso adicional da argamassa pode sobrecarregar a estrutura e as telhas. As peças complementares BRASILIT são especialmente projetadas para garantir a vedação adequada e acompanhar as movimentações do sistema, sendo sua utilização obrigatória. É necessária a remoção completa da argamassa e substituição por peças complementares originais apropriadas.",
  "Fixação de Acessórios Complementares Realizada de Forma Inadequada":
    "A análise técnica identificou que os acessórios complementares (rufos, calhas, pingadeiras, etc.) não estão fixados de acordo com as especificações técnicas do fabricante. A fixação adequada destes elementos é crucial para o desempenho do sistema de cobertura. Os rufos devem ser fixados à estrutura e nunca diretamente nas telhas, com sobreposição mínima de 5cm sobre as telhas e vedação apropriada. As calhas devem ter dimensionamento adequado, inclinação mínima de 0,5% e estar corretamente fixadas à estrutura. O espaçamento entre os suportes deve seguir as especificações do fabricante. A fixação inadequada pode resultar em infiltrações, transbordamentos, oxidação da estrutura e danos ao sistema de cobertura. É necessária a revisão completa da fixação dos acessórios complementares, seguindo rigorosamente as recomendações técnicas.",
};

const ISSUE_IMAGES = {
  "Armazenagem Incorreta": "/attached_assets/images/armazenagem-incorreta.png",
  "Carga Permanente sobre as Telhas": "/attached_assets/images/carga-permanente.png",
  "Corte de Canto Incorreto ou Ausente": "/attached_assets/images/corte-canto-incorreto.png",
  "Fixação Irregular das Telhas": "/attached_assets/images/fixacao-irregular.png",
  "Inclinação da Telha Inferior ao Recomendado": "/attached_assets/images/inclinacao-incorreta.png",
  "Marcas de Caminhamento sobre o Telhado": "/attached_assets/images/marca-caminhamento.png",
  "Balanço Livre do Beiral Incorreto": "/attached_assets/images/balanco-incorreto.png"
};

export function InspectionSystem() {
  const [formData, setFormData] = useState<FormData>({
    clientName: "",
    dateInspected: format(new Date(), "yyyy-MM-dd"),
    constructionType: "",
    address: "",
    city: "",
    technicianName: "",
    protocolNumber: "",
    department: "Assistência Técnica",
    unit: "PR",
    region: "Sul",
    coordinatorName: "Marlon Weingartner",
    managerName: "Elisabete Kudo",
    inspectionSubject: "",
    tileSpecs: [{
      model: "",
      thickness: "",
      dimensions: "",
      count: "",
    }],
    selectedIssues: [],
  });

  const reportRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (issue: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedIssues: checked
        ? [...prev.selectedIssues, issue]
        : prev.selectedIssues.filter((i) => i !== issue),
    }));
  };

  const generateReport = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`relatorio-${format(new Date(), "yyyy-MM-dd")}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-2xl font-bold mb-6">Formulário de Inspeção</h1>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* Client Information */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-semibold text-gray-700 mb-2">
                    Nome do Cliente *
                  </label>
                  <input
                    type="text"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="Digite o nome completo do cliente"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data da Vistoria
                  </label>
                  <input
                    type="date"
                    name="dateInspected"
                    value={formData.dateInspected}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Issues Section */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">Problemas Identificados</h2>
              <div className="grid grid-cols-1 gap-3">
                {ROOF_ISSUES.map((issue) => (
                  <div key={issue} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      id={issue}
                      checked={formData.selectedIssues.includes(issue)}
                      onChange={(e) => handleCheckboxChange(issue, e.target.checked)}
                      className="h-5 w-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor={issue} className="flex-1 text-sm">
                      {issue}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Report Button */}
            <button
              type="button"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              onClick={generateReport}
            >
              Gerar Relatório
            </button>
          </form>
        </div>

        {/* Hidden Report Template */}
        <div ref={reportRef} className="hidden">
          <div className="bg-white p-8" style={{ width: '210mm', minHeight: '297mm' }}>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold">SAINT-GOBAIN BRASIL</h1>
              <h2 className="text-xl">Divisão Brasilit - Assistência Técnica</h2>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">RELATÓRIO DE VISTORIA TÉCNICA</h1>
            </div>

            {/* Client Info */}
            <div className="mb-8">
              <p><strong>Cliente:</strong> {formData.clientName}</p>
              <p><strong>Data da Vistoria:</strong> {format(new Date(formData.dateInspected), "dd/MM/yyyy")}</p>
            </div>

            {/* Issues */}
            <div className="mb-8">
              {formData.selectedIssues.map((issue, index) => (
                <div key={issue} className="mb-6">
                  <h3 className="text-xl font-bold mb-2">{`${index + 1}. ${issue}`}</h3>
                  <p className="mb-4">{ISSUE_DESCRIPTIONS[issue]}</p>
                  {ISSUE_IMAGES[issue] && (
                    <div className="mb-4">
                      <img 
                        src={ISSUE_IMAGES[issue]} 
                        alt={`Exemplo de ${issue}`}
                        className="max-w-full h-auto"
                        crossOrigin="anonymous"
                      />
                      <p className="text-sm text-gray-600 mt-1 italic">
                        Exemplo ilustrativo de {issue.toLowerCase()}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Conclusion */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Conclusão</h2>
              <p className="text-justify">
                {formData.selectedIssues.length > 0
                  ? "Em função das não conformidades constatadas no manuseio e instalação das chapas Brasilit, finalizamos o atendimento considerando a reclamação como IMPROCEDENTE, onde os problemas reclamados se dão pelo incorreto manuseio e instalação das telhas e não a problemas relacionados à qualidade do material."
                  : "A análise técnica não identificou não conformidades significativas. As telhas e sua instalação atendem às especificações técnicas e recomendações do fabricante."}
              </p>
            </div>

            {/* Signature */}
            <div className="mt-16">
              <p>Atenciosamente,</p>
              <p className="mt-4">Saint-Gobain do Brasil Prod. Ind. e para Cons. Civil Ltda.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}