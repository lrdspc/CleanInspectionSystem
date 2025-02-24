import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const problems = [
  'armazenagem-incorreta',
  'carga-permanente',
  'corte-canto',
  'estrutura-desalinhada',
  'fixacao-irregular',
  'inclinacao-incorreta',
  'marcas-caminhamento',
  'balanco-incorreto',
  'numero-apoios',
  'recobrimento-incorreto',
  'sentido-montagem',
  'cumeeira-ceramica',
  'argamassa',
  'fixacao-acessorios'
];

// Ensure the directory exists
const dir = path.join(process.cwd(), 'public', 'images', 'problems');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Generate an SVG for each problem
problems.forEach(problem => {
  const svg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#E5E7EB"/>
  <text x="50%" y="50%" 
        font-family="Arial" 
        font-size="16" 
        fill="#374151"
        text-anchor="middle"
        dominant-baseline="middle">
    Exemplo de problema: ${problem.replace(/-/g, ' ')}
  </text>
</svg>`;

  fs.writeFileSync(path.join(dir, `${problem}.svg`), svg);
});

console.log('Imagens placeholder geradas com sucesso!');