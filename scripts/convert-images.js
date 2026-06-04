/**
 * Converte todas as imagens JPEG/PNG da pasta images/ para WebP.
 *
 * Como usar (na raiz do projeto):
 *   1. npm install sharp
 *   2. node scripts/convert-images.js
 *
 * Os arquivos WebP são salvos na mesma pasta com o mesmo nome.
 * Os originais são preservados como fallback.
 */

const sharp = require('sharp');
const fs    = require('fs');
const path  = require('path');

const INPUT_DIR = path.join(__dirname, '..', 'frontend', 'pages', 'images');
const QUALITY   = 82;

// Favicons e ícones PWA ficam em PNG — navegadores e dispositivos exigem esse formato
const SKIP_FILES = new Set([
  'favicon-16x16.png',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'android-chrome-192x192.png',
  'android-chrome-512x512.png',
]);

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
  if (f.includes('plano-de-fundo') || f.includes('imagemdefundo')) return MAX_WIDTHS.hero;
  if (f.includes('corte') || f.includes('degrade') || f.includes('cacheado') ||
      f.includes('flat') || f.includes('classico') || f.includes('visagismo')) return MAX_WIDTHS.corte;
  if (f.includes('produto')) return MAX_WIDTHS.produto;
  if (f.includes('logo')) return MAX_WIDTHS.logo;
  if (f.includes('whatsapp') || f.includes('instagram') ||
      f.includes('location') || f.includes('telefone') ||
      f.includes('missao') || f.includes('visao') || f.includes('valores')) return MAX_WIDTHS.icone;
  return MAX_WIDTHS.default;
}

async function convertAll() {
  const files = fs.readdirSync(INPUT_DIR).filter(f =>
    /\.(jpe?g|png)$/i.test(f) && !f.startsWith('.') && !SKIP_FILES.has(f)
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

      fs.unlinkSync(inputPath);

      console.log(`✓ ${file.padEnd(55)} ${(originalSize/1024).toFixed(0).padStart(5)} KB → ${(newSize/1024).toFixed(0).padStart(5)} KB  (${saving}% menor)`);
    } catch (err) {
      console.error(`✗ Erro em ${file}: ${err.message}`);
    }
  }

  console.log('\nConcluído! Os arquivos .webp foram gerados na pasta images/.');
}

convertAll();
