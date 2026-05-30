/**
 * Converte todas as imagens JPEG/PNG da pasta Imagens/ para WebP.
 *
 * Como usar:
 *   1. npm install sharp
 *   2. node convert-images.js
 *
 * Os arquivos WebP são salvos na mesma pasta com o mesmo nome.
 * Os originais são preservados como fallback.
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const INPUT_DIR  = path.join(__dirname, 'frontend', 'pages', 'Imagens');
const QUALITY    = 82;

// Larguras máximas por tipo de imagem (redimensiona se maior)
const MAX_WIDTHS = {
  hero:    1440,
  corte:    800,
  produto:  600,
  icone:    128,
  logo:     400,
  default: 1200,
};

function getMaxWidth(filename) {
  const f = filename.toLowerCase();
  if (f.includes('plano de fundo') || f.includes('imagemdefundo')) return MAX_WIDTHS.hero;
  if (f.includes('corte') || f.includes('degrade') || f.includes('cacheado') ||
      f.includes('flat') || f.includes('classico') || f.includes('visagismo')) return MAX_WIDTHS.corte;
  if (f.includes('produto')) return MAX_WIDTHS.produto;
  if (f.includes('logo')) return MAX_WIDTHS.logo;
  if (f.includes('whatsapp') || f.includes('instagram') ||
      f.includes('location') || f.includes('telefone') ||
      f.includes('missao') || f.includes('visao') || f.includes('valores') ||
      f.includes('missão') || f.includes('visão')) return MAX_WIDTHS.icone;
  return MAX_WIDTHS.default;
}

async function convertAll() {
  const files = fs.readdirSync(INPUT_DIR).filter(f =>
    /\.(jpe?g|png)$/i.test(f) && !f.startsWith('.')
  );

  console.log(`Convertendo ${files.length} imagens para WebP (qualidade ${QUALITY})...\n`);

  for (const file of files) {
    const inputPath  = path.join(INPUT_DIR, file);
    const outputName = file.replace(/\.(jpe?g|png)$/i, '.webp');
    const outputPath = path.join(INPUT_DIR, outputName);
    const maxWidth   = getMaxWidth(file);

    try {
      const img = sharp(inputPath);
      const meta = await img.metadata();
      const width = meta.width && meta.width > maxWidth ? maxWidth : undefined;

      await img
        .resize(width ? { width, withoutEnlargement: true } : undefined)
        .webp({ quality: QUALITY })
        .toFile(outputPath);

      const originalSize = fs.statSync(inputPath).size;
      const newSize      = fs.statSync(outputPath).size;
      const saving       = (((originalSize - newSize) / originalSize) * 100).toFixed(1);

      console.log(`✓ ${file.padEnd(55)} ${(originalSize/1024).toFixed(0).padStart(5)} KB → ${(newSize/1024).toFixed(0).padStart(5)} KB  (${saving}% menor)`);
    } catch (err) {
      console.error(`✗ Erro em ${file}: ${err.message}`);
    }
  }

  console.log('\nConcluído! Atualize os src das imagens no HTML para os novos .webp.');
}

convertAll();
