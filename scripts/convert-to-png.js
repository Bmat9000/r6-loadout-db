const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const folders = [
  path.join(__dirname, '..', 'assets', 'weapons', 'primary'),
  path.join(__dirname, '..', 'assets', 'weapons', 'secondary'),
];

function getConvertibleFiles(folder) {
  const files = fs.readdirSync(folder);
  return files.filter(f => /\.(avif|webp)$/i.test(f));
}

async function main() {
  let converted = 0;

  for (const folder of folders) {
    const targets = getConvertibleFiles(folder);

    for (const file of targets) {
      const inputPath = path.join(folder, file);
      const outputName = path.basename(file, path.extname(file)) + '.png';
      const outputPath = path.join(folder, outputName);

      try {
        await sharp(inputPath).png().toFile(outputPath);
        fs.unlinkSync(inputPath);
        console.log(`✅ Converted: ${file} → ${outputName}`);
        converted++;
      } catch (err) {
        console.error(`❌ Failed to convert ${file}:`, err.message);
      }
    }
  }

  console.log(`\nDone! Converted ${converted} files.`);
}

main();
